"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ANIMALS, BARNS, CROPS, CROP_UNLOCK_LEVEL, MACHINES, MARKET_GOODS, SIDE_MISSIONS, WEATHER, barnPlacementError, cropProgress, getCurrentSeason, getMapProgress, getTownOrder, getWeather, inventoryUsed, isCropReady, machinePlacementError, timeLeft, type BarnId, type CropId, type FarmSave, type MachineId } from "@/game/state/farm-rules";
import { CHAPTERS, MISSIONS, chapterName, levelForXp, xpToNextLevel, xpWithinLevel } from "@/game/state/progression";
import { MAPS, SEASON_LABELS, seasonDay, type MapId } from "@/game/state/worlds";
import { useUiStore } from "@/game/state/ui-store";

const FarmCanvas = dynamic(() => import("@/game/world/farm-canvas"), {
  ssr: false,
  loading: () => <div className="canvas-loading">Menyiapkan dunia kebun…</div>,
});

function Item({ icon, label, value }: { icon: string; label: string; value: number }) {
  return <div className="inventory-item"><span aria-hidden="true">{icon}</span><small>{label}</small><strong>{value}</strong></div>;
}

const tutorialLines = [
  { title: "Selamat datang di desa!", text: "Aku Rosco. Lembah ini punya banyak ruang untuk kebun impianmu." },
  { title: "Mulai dari lahan", text: "Pilih batu abu-abu di kebun, lalu bersihkan agar tanahnya siap ditanami." },
  { title: "Pilih benih", text: "Gunakan gandum untuk mulai. Benih lain bisa kamu beli di toko." },
  { title: "Tanam dan tunggu", text: "Pilih petak kosong, tentukan tanaman, lalu biarkan waktu bekerja." },
  { title: "Panen hasilnya", text: "Tanaman matang akan berkilau. Panen untuk mendapat hasil, benih, XP, dan koin." },
  { title: "Mesin membantu", text: "Masukkan hasil panen ke mesin. Setiap mesin punya resep dan waktu sendiri." },
  { title: "Bantu tetangga", text: "Kirim pakan kepada Rosco untuk mendapatkan koin, XP, dan hati." },
  { title: "Kembangkan kebun", text: "Belanja benih dan mesin, perluas lahan, tata petak, lalu selesaikan beberapa misi sekaligus." },
];

function frontierTiles(plots: { x: number; z: number }[]): [number, number][] {
  const found = new Map<string, [number, number]>();
  for (const plot of plots) for (const [dx, dz] of [[1,0],[-1,0],[0,1],[0,-1]]) {
    const x = plot.x + dx; const z = plot.z + dz; const key = `${x}:${z}`;
    if (!plots.some((owned) => owned.x === x && owned.z === z)) found.set(key, [x,z]);
  }
  return [...found.values()].sort((a,b) => a[1]-b[1] || a[0]-b[0]);
}
function seedKey(crop: CropId): keyof FarmSave {
  if (crop === "wheat") return "seeds";
  if (crop === "cactus-fruit") return "cactusFruitSeeds";
  return `${crop}Seeds` as ReturnType<typeof seedKey>;
}
function cropEmoji(crop: CropId): string { return ({ wheat: "🌾", carrot: "🥕", tomato: "🍅", pineapple: "🍍", coconut: "🥥", blueberry: "🫐", pumpkin: "🎃", potato: "🥔", "cactus-fruit": "🌵", corn: "🌽", onion: "🧅", strawberry: "🍓", apple: "🍎", lemon: "🍋", apricot: "🍑", olive: "🫒", mushroom: "🍄" })[crop]; }
function mapIcon(id: MapId): string { return ({ "green-meadows": "🌿", "tropical-valley": "🌴", "autumn-woods": "🍂", "frostpeak-highlands": "❄", "desert-oasis": "🌵", "coastal-islands": "🌊" })[id]; }
function WEATHER_LABEL(id: ReturnType<typeof getWeather>): string { return WEATHER[id].name; }
function machineStageLabel(type: MachineId, startedAt: number | undefined, readyAt: number, now: number): string {
  const progress = startedAt ? Math.min(1, Math.max(0, (now - startedAt) / Math.max(1, readyAt - startedAt))) : now >= readyAt ? 1 : 0;
  if (type === "bakery") return progress < 0.2 ? "Mengaduk adonan" : progress < 0.46 ? "Membentuk roti" : progress < 0.82 ? "Memanggang" : progress < 1 ? "Mendinginkan" : "Hasil siap diambil";
  return progress >= 1 ? "Hasil siap diambil" : "Sedang berproduksi";
}

export default function GreenFarmGame() {
  const farm = useUiStore((state) => state.farm);
  const selectedPlot = useUiStore((state) => state.selectedPlot);
  const message = useUiStore((state) => state.message);
  const hydrated = useUiStore((state) => state.hydrated);
  const activeMapId = useUiStore((state) => state.farm.activeMapId);
  const unlockedMapIds = useUiStore((state) => state.farm.unlockedMapIds);
  const seasonStartedAt = useUiStore((state) => state.farm.seasonStartedAt);
  const setSelectedPlot = useUiStore((state) => state.setSelectedPlot);
  const hydrate = useUiStore((state) => state.hydrate);
  const clear = useUiStore((state) => state.clear);
  const harvest = useUiStore((state) => state.harvest);
  const startFeed = useUiStore((state) => state.startFeed);
  const collectFeed = useUiStore((state) => state.collectFeed);
  const deliverOrder = useUiStore((state) => state.deliverOrder);
  const claim = useUiStore((state) => state.claim);
  const claimSide = useUiStore((state) => state.claimSide);
  const buySeeds = useUiStore((state) => state.buySeeds);
  const buyLandTile = useUiStore((state) => state.buyLandTile);
  const buyMachineType = useUiStore((state) => state.buyMachineType);
  const upgradeMachineById = useUiStore((state) => state.upgradeMachineById);
  const movePlotBy = useUiStore((state) => state.movePlotBy);
  const moveMachineTo = useUiStore((state) => state.moveMachineTo);
  const moveBarnTo = useUiStore((state) => state.moveBarnTo);
  const startMachine = useUiStore((state) => state.startMachine);
  const collectMachine = useUiStore((state) => state.collectMachine);
  const plantCropOnPlot = useUiStore((state) => state.plantCropOnPlot);
  const setTutorial = useUiStore((state) => state.setTutorial);
  const unlockWorldMap = useUiStore((state) => state.unlockWorldMap);
  const travelMap = useUiStore((state) => state.travelMap);
  const buyAnimalType = useUiStore((state) => state.buyAnimalType);
  const buyBarnType = useUiStore((state) => state.buyBarnType);
  const upgradeBarnById = useUiStore((state) => state.upgradeBarnById);
  const feedAnimalById = useUiStore((state) => state.feedAnimalById);
  const collectAnimalById = useUiStore((state) => state.collectAnimalById);
  const sellGoodsFromMarket = useUiStore((state) => state.sellGoodsFromMarket);
  const deliverOrderToMarket = useUiStore((state) => state.deliverOrderToMarket);
  const expandWarehouse = useUiStore((state) => state.expandWarehouse);
  const reset = useUiStore((state) => state.reset);
  const [now, setNow] = useState(0);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<CropId>("wheat");
  const [mapPanelOpen, setMapPanelOpen] = useState(false);
  const [marketOpen, setMarketOpen] = useState(false);
  const [barnOpen, setBarnOpen] = useState(false);
  const [placementDraft, setPlacementDraft] = useState<{ kind: "machine" | "barn"; id: string; x: number; z: number; rotation: number } | null>(null);
  const [activeTab, setActiveTab] = useState("Kebun");

  useEffect(() => {
    hydrate();
    const firstTick = window.setTimeout(() => setNow(Date.now()), 0);
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => {
      window.clearTimeout(firstTick);
      window.clearInterval(interval);
    };
  }, [hydrate]);

  const activePlot = useMemo(() => farm.plots.find((plot) => plot.id === selectedPlot) ?? null, [farm.plots, selectedPlot]);
  const activeMachine = useMemo(() => farm.machines.find((machine) => machine.id === selectedPlot) ?? null, [farm.machines, selectedPlot]);
  const selectedBarnId = selectedPlot?.startsWith("barn:") ? selectedPlot.slice(5) : null;
  const activeBarn = useMemo(() => farm.barns.find((barn) => barn.id === selectedBarnId) ?? null, [farm.barns, selectedBarnId]);
  const barnAnimals = activeBarn ? farm.animals.filter((animal) => animal.barnId === activeBarn.id || (!animal.barnId && activeBarn.type === "chicken-coop")) : [];
  const selectedAnimal = barnAnimals[0] ?? null;
  const previewError = placementDraft ? placementDraft.kind === "machine" && activeMachine ? machinePlacementError(farm, activeMachine.type, placementDraft.x, placementDraft.z, activeMachine.id) : placementDraft.kind === "barn" && activeBarn ? barnPlacementError(farm, activeBarn.type, placementDraft.x, placementDraft.z, placementDraft.rotation, activeBarn.id) : null : null;
  const cropReady = activePlot ? isCropReady(activePlot, now) : false;
  const cropSeconds = activePlot?.kind === "growing" ? timeLeft(activePlot.readyAt, now) : 0;
  const level = levelForXp(farm.xp);
  const xpInLevel = xpWithinLevel(farm.xp);
  const xpRequired = xpToNextLevel(level);
  const mission = MISSIONS[farm.missionIndex];
  const activeMap = MAPS.find((map) => map.id === activeMapId)!;
  const plantCropId = (activeMap.cropIds.includes(selectedCrop) ? selectedCrop : activeMap.cropIds[0]) as CropId;
  const season = getCurrentSeason(farm, now);
  const weather = getWeather(farm, now);
  const marketOrder = getTownOrder(farm, now);
  const storageUsed = inventoryUsed(farm);
  const warehouseCost = Math.round((farm.storageCapacity - 40) * 1.4 + 120);

  function beginMachineMove() {
    if (!activeMachine) return;
    setPlacementDraft({ kind: "machine", id: activeMachine.id, x: activeMachine.x, z: activeMachine.z, rotation: activeMachine.rotation ?? 0 });
    setEditMode(true);
  }
  function beginBarnMove() {
    if (!activeBarn) return;
    setPlacementDraft({ kind: "barn", id: activeBarn.id, x: activeBarn.x, z: activeBarn.z, rotation: activeBarn.rotation });
    setEditMode(true);
  }
  function buildBarn(type: BarnId) {
    const before = useUiStore.getState().farm.barns.length;
    buyBarnType(type);
    const created = useUiStore.getState().farm.barns[before];
    if (created) { setSelectedPlot(`barn:${created.id}`); setShopOpen(false); }
  }
  function shiftMachine(dx: number, dz: number) {
    if (!placementDraft) return;
    setPlacementDraft({ ...placementDraft, x: placementDraft.x + dx, z: placementDraft.z + dz });
  }
  function confirmMachineMove() {
    if (!placementDraft || previewError) return;
    if (placementDraft.kind === "machine") moveMachineTo(placementDraft.id, placementDraft.x, placementDraft.z, placementDraft.rotation);
    else moveBarnTo(placementDraft.id, placementDraft.x, placementDraft.z, placementDraft.rotation);
    setPlacementDraft(null);
    setEditMode(false);
  }
  function selectBottomTab(tab: string) {
    setActiveTab(tab);
    if (tab === "Tanam") { const soil = farm.plots.find((plot) => plot.kind === "soil"); if (soil) setSelectedPlot(soil.id); }
    if (tab === "Bangun") setShopOpen(true);
    if (tab === "Produksi") { const machine = farm.machines[0]; if (machine) setSelectedPlot(machine.id); }
    if (tab === "Tas") setMarketOpen(true);
    if (tab === "Misi") { setShowRoadmap(true); document.querySelector(".mission-card")?.scrollIntoView({ behavior: "smooth", block: "start" }); }
  }

  function askReset() {
    if (window.confirm("Mulai ulang kebun? Save lokal saat ini akan dihapus.")) reset();
  }

  return (
    <main className="game-shell">
      <header className="game-topbar">
        <Link className="brand" href="/"><span className="brand-mark">✿</span> Green Farm</Link>
        <span className="game-location"><span className="location-dot" /> {activeMap.name.toUpperCase()} <span className="location-divider">·</span> {SEASON_LABELS[season].toUpperCase()}</span>
        <button className="reset-link" type="button" onClick={askReset}>Mulai ulang</button>
      </header>

      <section className="game-layout" aria-label="Kebun Green Farm">
        <aside className="game-sidebar">
          <p className="eyebrow">HARI {Math.max(1, Math.floor(Math.max(0, now - seasonStartedAt) / 180_000) + 1)} · {SEASON_LABELS[season].toUpperCase()}</p>
          <h1>Kebun<br /><span>menantimu.</span></h1>
          <p className="sidebar-description">Rawat tanaman, penuhi pesanan, dan buat desa ini tumbuh bersama.</p>

          <div className="inventory-card" aria-label="Inventaris kebun">
            <div className="inventory-heading"><span>TAS KEBUN · {storageUsed}/{farm.storageCapacity}</span><span>LEVEL {level} · {farm.xp} XP</span></div>
            <div className="level-progress" role="progressbar" aria-valuemin={0} aria-valuemax={level >= 100 ? 100 : xpRequired} aria-valuenow={level >= 100 ? 100 : Math.min(xpInLevel, xpRequired)} aria-label={level >= 100 ? "Level 100, level maksimum" : `Level ${level}, ${xpInLevel} dari ${xpRequired} XP menuju level berikutnya`}><span style={{ width: `${level >= 100 ? 100 : Math.min(100, Math.round(xpInLevel / xpRequired * 100))}%` }} /></div>
            <div className="level-caption"><span>{chapterName(level)}</span><span>{level >= 100 ? "LEVEL MAKS" : `${xpInLevel} / ${xpRequired} XP`}</span></div>
            <div className="inventory-grid">
              <Item icon="✿" label="Koin" value={farm.coins} />
              <Item icon="🌱" label="Benih" value={farm.seeds + farm.carrotSeeds + farm.tomatoSeeds} />
              <Item icon="🌾" label="Gandum" value={farm.wheat} />
              <Item icon="🥚" label="Produk ternak" value={farm.eggs + farm.milk + farm.honey + farm.wool} />
            </div>
          </div>

          <section className="mission-card" aria-label="Misi utama">
            <div className="mission-card-top"><span className="mission-emblem">✦</span><div><small>MISI UTAMA · BAB {mission?.chapter ?? 10}</small><strong>{mission ? mission.title : "Semua misi selesai!"}</strong></div><span className="mission-number">{mission ? `${mission.id}/100` : "100/100"}</span></div>
            <p>{mission ? mission.description : "Kamu telah menyelesaikan perjalanan Green Farm."}</p>
            {mission && <>
              <div className="mission-meter" role="progressbar" aria-valuemin={0} aria-valuemax={mission.target} aria-valuenow={Math.min(farm.missionProgress, mission.target)} aria-label={`Progres ${mission.title}`}><span style={{ width: `${Math.min(100, Math.round(farm.missionProgress / mission.target * 100))}%` }} /></div>
              <div className="mission-meta"><span>Progres <b>{Math.min(farm.missionProgress, mission.target)}/{mission.target}</b></span><span>Hadiah <b>+{mission.xp} XP · +{mission.coins} koin</b></span></div>
              <button className="action-button mission-claim" type="button" disabled={farm.missionProgress < mission.target} onClick={claim}>{farm.missionProgress >= mission.target ? "Ambil hadiah misi" : "Selesaikan target"}</button>
            </>}
            <button className="roadmap-toggle" type="button" aria-expanded={showRoadmap} onClick={() => setShowRoadmap((open) => !open)}>{showRoadmap ? "Tutup peta perjalanan" : "Lihat perjalanan level 1–100"}<span>{showRoadmap ? "−" : "+"}</span></button>
            {showRoadmap && <div className="roadmap-list" aria-label="10 bab, 100 misi">
              {CHAPTERS.map((chapter) => {
                const completed = Math.max(0, Math.min(10, farm.missionIndex - chapter.from + 1));
                const isCurrent = farm.missionIndex >= chapter.from - 1 && farm.missionIndex < chapter.to;
                return <div className={`roadmap-chapter${isCurrent ? " current" : ""}`} key={chapter.number}>
                  <div><small>BAB {String(chapter.number).padStart(2, "0")} · MISI {chapter.from}–{chapter.to}</small><strong>{chapter.name}</strong></div>
                  <div className="roadmap-steps" aria-label={`${completed} dari 10 misi selesai`}>{Array.from({ length: 10 }, (_, step) => <i className={chapter.from + step <= farm.missionIndex ? "done" : chapter.from + step === farm.missionIndex + 1 ? "active" : ""} key={step} title={`Misi ${chapter.from + step}`} />)}</div>
                </div>;
              })}
              <p className="roadmap-note">100 misi utama · 10 bab · progres tersimpan di perangkat ini</p>
            </div>}
          </section>

          <section className="mission-card side-missions" aria-label="Misi tambahan">
            <div className="mission-card-top"><span className="mission-emblem side-emblem">＋</span><div><small>MISI SAMPINGAN</small><strong>Hal lain untuk dikerjakan</strong></div></div>
            {SIDE_MISSIONS.map((side) => {
              const state = farm.sideMissions.find((item) => item.id === side.id);
              if (!state) return null;
              return <div className="side-mission-row" key={side.id}><div><strong>{side.title}</strong><small>{state.claimed ? "Selesai" : side.description} · {Math.min(side.target, state.progress)}/{side.target}</small></div><button type="button" disabled={state.claimed || state.progress < side.target} onClick={() => claimSide(side.id)}>{state.claimed ? "✓" : state.progress >= side.target ? "Klaim" : "·"}</button></div>;
            })}
          </section>

          <div className="task-card">
            <div className="task-head"><span className="task-avatar">R</span><div><small>TETANGGA</small><strong>Permintaan Rosco</strong></div><span className="heart-count">♥ {farm.hearts}</span></div>
            <p>Rosco membutuhkan <b>1 pakan ternak</b> untuk hewannya.</p>
            <div className="order-reward"><span>Hadiah</span><strong>+30 koin</strong><strong>+12 XP</strong></div>
            <button className="action-button order-button" type="button" disabled={farm.orderDelivered || farm.animalFeed < 1} onClick={deliverOrder}>
              {farm.orderDelivered ? "Pesanan selesai ✓" : "Kirim pakan ke Rosco"}
            </button>
          </div>

          <div className="action-card" aria-live="polite">
            <div className="action-heading"><span>{activeMachine ? "AKSI MESIN" : activeBarn ? "AKSI KANDANG" : "AKSI LAHAN"}</span><span>{activePlot ? `PETAK ${activePlot.id}` : activeMachine ? MACHINES[activeMachine.type].name : activeBarn ? BARNS[activeBarn.type].name : "PILIH DI DUNIA"}</span></div>
            {!activeMachine && !activeBarn && <div className="farm-plot-picker" role="group" aria-label="Pilih petak kebun">
              {farm.plots.map((plot) => <button key={plot.id} type="button" aria-pressed={selectedPlot === plot.id} onClick={() => setSelectedPlot(plot.id)}>
                {plot.id}<span>{plot.kind === "blocked" ? "Batu" : plot.kind === "soil" ? "Tanah" : isCropReady(plot, now) ? "Panen" : "Tumbuh"}</span>
              </button>)}
            </div>}
            {activeMachine ? (() => {
              const def = MACHINES[activeMachine.type]; const seconds = activeMachine.job ? timeLeft(activeMachine.job.readyAt, now) : 0;
              const missing = Object.entries(def.input).filter(([key, amount]) => Number(farm[key as keyof FarmSave]) < (amount ?? 0));
              return <div className="context-object-panel"><p className="selected-name">{activeMachine.job ? `${machineStageLabel(activeMachine.type, activeMachine.job.startedAt, activeMachine.job.readyAt, now)}${seconds ? ` · ${seconds} detik tersisa` : ""}` : missing.length ? `Perlu bahan: ${missing.map(([key, amount]) => `${amount} ${key}`).join(", ")}` : "Siap memulai produksi"}</p><p className="context-recipe">Resep: {def.recipe} · Level {activeMachine.level} · posisi ({activeMachine.x}, {activeMachine.z})</p>{activeMachine.job ? <button className="action-button" type="button" disabled={seconds > 0 || storageUsed >= farm.storageCapacity} title={storageUsed >= farm.storageCapacity ? "Gudang penuh. Jual hasil dulu." : undefined} onClick={() => collectMachine(activeMachine.id, Date.now())}>{seconds ? `Proses ${seconds} dtk` : "Ambil hasil"}</button> : <button className="action-button" type="button" disabled={missing.length > 0} title={missing.length ? `Bahan belum cukup: ${missing.map(([key, amount]) => `${amount} ${key}`).join(", ")}` : undefined} onClick={() => startMachine(activeMachine.id, Date.now())}>Mulai produksi · {Math.ceil(def.duration / 1000)} dtk</button>}{activeMachine.job && <div className="timer-box"><span className="timer-track"><i style={{ width: `${activeMachine.job.startedAt ? Math.round(Math.min(1, Math.max(0, (now - activeMachine.job.startedAt) / (activeMachine.job.readyAt - activeMachine.job.startedAt))) * 100) : seconds ? 0 : 100}%` }} /></span><strong>{seconds ? "BERPROSES" : "SIAP"}</strong></div>}<button className="action-button secondary-action" type="button" onClick={() => upgradeMachineById(activeMachine.id)}>Upgrade mesin · {activeMachine.level * 80} koin</button><button className="action-button secondary-action" type="button" onClick={beginMachineMove}>⌖ Pindahkan mesin</button></div>;
            })() : activeBarn ? <div className="context-object-panel"><p className="selected-name">{BARNS[activeBarn.type].name} · Lv {activeBarn.level} · {barnAnimals.length}/{BARNS[activeBarn.type].capacity + (activeBarn.level - 1) * 5} hewan</p><p className="context-recipe">Pakan tersedia: {farm.animalFeed} · {barnAnimals.filter((animal) => animal.readyAt && animal.readyAt <= now).length} hasil siap diambil</p>{selectedAnimal && (() => { const def = ANIMALS[selectedAnimal.type]; const seconds = selectedAnimal.readyAt ? timeLeft(selectedAnimal.readyAt, now) : 0; return <div className="coop-highlight"><span>{def.icon}</span><div><strong>{def.name} · Lv {selectedAnimal.level}</strong><small>{selectedAnimal.readyAt ? seconds ? `Produksi · ${seconds} detik` : `${def.productName} siap` : "Menunggu pakan"}</small></div><button className="action-button" type="button" disabled={selectedAnimal.readyAt ? seconds > 0 : farm.animalFeed < 1} onClick={() => selectedAnimal.readyAt ? collectAnimalById(selectedAnimal.id, Date.now()) : feedAnimalById(selectedAnimal.id, Date.now())}>{selectedAnimal.readyAt ? seconds ? "Proses…" : "Ambil" : "Beri pakan"}</button></div>; })()}<button className="action-button secondary-action" type="button" onClick={() => setBarnOpen(true)}>Kelola semua ternak</button><button className="action-button secondary-action" type="button" onClick={() => upgradeBarnById(activeBarn.id)}>Upgrade kapasitas · {activeBarn.level * 110} koin</button><button className="action-button secondary-action" type="button" onClick={beginBarnMove}>⌖ Pindahkan kandang</button></div> : !activePlot ? <p className="empty-selection">Pilih petak, kandang, atau mesin langsung di dunia kebun.</p> : <>
              <p className="selected-name">{activePlot.kind === "blocked" ? "Tumpukan batu" : activePlot.kind === "soil" ? "Tanah siap ditanam" : cropReady ? `${CROPS[activePlot.crop ?? "wheat"].name} siap panen!` : `${CROPS[activePlot.crop ?? "wheat"].name} tumbuh`}</p>
              {activePlot.kind === "blocked" && <button className="action-button" type="button" onClick={() => clear(activePlot.id)}>Bersihkan batu</button>}
              {activePlot.kind === "soil" && <><select className="crop-select" aria-label="Pilih tanaman" value={plantCropId} onChange={(event) => setSelectedCrop(event.target.value as CropId)}>{activeMap.cropIds.map((cropId) => { const crop = cropId as CropId; const amount = farm[seedKey(crop)] as number; return <option value={crop} key={crop} disabled={level < CROP_UNLOCK_LEVEL[crop]}>{CROPS[crop].name} · {amount} benih{level < CROP_UNLOCK_LEVEL[crop] ? ` · Lv ${CROP_UNLOCK_LEVEL[crop]}` : !CROPS[crop].seasons.includes(getCurrentSeason(farm, now, activePlot.x)) ? " · di luar musim" : ""}</option>; })}</select><button className="action-button" type="button" disabled={(farm[seedKey(plantCropId)] as number) < 1 || level < CROP_UNLOCK_LEVEL[plantCropId] || !CROPS[plantCropId].seasons.includes(getCurrentSeason(farm, now, activePlot.x))} onClick={() => plantCropOnPlot(activePlot.id, plantCropId, Date.now())}>Tanam {CROPS[plantCropId].name.toLowerCase()}</button></>}
              {activePlot.kind === "growing" && <div className="timer-box"><span className="timer-track"><i style={{ width: `${Math.round(cropProgress(activePlot, now) * 100)}%` }} /></span><strong>{cropSeconds > 0 ? `${cropSeconds} dtk` : "Siap panen"}</strong></div>}
              {(activePlot.kind === "growing" && cropReady) && <button className="action-button" type="button" onClick={() => harvest(activePlot.id, Date.now())}>Panen {CROPS[activePlot.crop ?? "wheat"].name.toLowerCase()}</button>}
              {activePlot.kind === "ready" && <button className="action-button" type="button" onClick={() => harvest(activePlot.id, Date.now())}>Panen {CROPS[activePlot.crop ?? "wheat"].name.toLowerCase()}</button>}
            </>}
            {editMode && activePlot && <div className="move-controls" aria-label="Pindahkan petak"><small>GESER PETAK</small><button onClick={() => movePlotBy(activePlot.id, 0, -1)}>↑</button><div><button onClick={() => movePlotBy(activePlot.id, -1, 0)}>←</button><button onClick={() => movePlotBy(activePlot.id, 0, 1)}>↓</button><button onClick={() => movePlotBy(activePlot.id, 1, 0)}>→</button></div></div>}
            {placementDraft && <div className="move-controls machine-placement" aria-label="Pratinjau penempatan objek"><small>GESER · {placementDraft.x}, {placementDraft.z}</small><button type="button" onClick={() => shiftMachine(0, -1)}>↑</button><div><button type="button" onClick={() => shiftMachine(-1, 0)}>←</button><button type="button" onClick={() => shiftMachine(0, 1)}>↓</button><button type="button" onClick={() => shiftMachine(1, 0)}>→</button></div><button type="button" onClick={() => setPlacementDraft({ ...placementDraft, rotation: (placementDraft.rotation + 1) % 4 })}>⟳ Putar {placementDraft.rotation * 90}°</button><p className={previewError ? "placement-error" : "placement-ok"}>{previewError ?? "Lokasi valid · tidak ada tabrakan"}</p><div className="placement-actions"><button type="button" disabled={Boolean(previewError)} onClick={confirmMachineMove}>Konfirmasi</button><button type="button" onClick={() => setPlacementDraft(null)}>Batal</button></div></div>}
          </div>

          <p className="game-message" role="status">{message}</p>
        </aside>

        <div className="scene-wrap">
          <div className="world-actions"><button type="button" onClick={() => setMapPanelOpen(true)}>▧ Peta dunia</button><button type="button" onClick={() => setShopOpen(true)}>✿ Toko</button><button type="button" onClick={() => setBarnOpen(true)}>🐔 Kandang</button><button type="button" onClick={() => setMarketOpen(true)}>↗ Pasar</button><button type="button" aria-pressed={editMode} onClick={() => setEditMode((value) => !value)}>{editMode ? "Selesai menata" : "⌖ Tata kebun"}</button></div>
          <div className="scene-toolbar"><span><i /> DUNIA KEBUN</span><span className="scene-hint">Pilih batu atau petak untuk beraksi</span></div>
          {hydrated && <FarmCanvas selectedPlot={selectedPlot} plots={farm.plots} machines={farm.machines} barns={farm.barns} animals={farm.animals} mapId={activeMapId} seasonStartedAt={seasonStartedAt} now={now} weather={weather} onSelectPlot={setSelectedPlot} placementPreview={placementDraft ? placementDraft.kind === "machine" && activeMachine ? { kind: "machine", x: placementDraft.x, z: placementDraft.z, type: activeMachine.type, valid: !previewError } : placementDraft.kind === "barn" && activeBarn ? { kind: "barn", x: placementDraft.x, z: placementDraft.z, type: activeBarn.type, rotation: placementDraft.rotation, valid: !previewError } : null : null} />}
          {!hydrated && <div className="canvas-loading">Memuat save kebun…</div>}
          <div className="scene-bottom"><span>{weather === "sunny" ? "☀" : weather === "rain" ? "☂" : weather === "storm" ? "⚡" : weather === "snow" ? "❄" : weather === "heat" ? "♨" : "〰"} &nbsp;{WEATHER_LABEL(weather).toUpperCase()} · {SEASON_LABELS[season].toUpperCase()}</span><span>ASET 3D ORISINAL <b>·</b> KAMERA ISOMETRIK</span></div>
          <div className="scene-compass" aria-hidden="true"><span>N</span><i>↑</i></div>
          <div className="mill-card machine-dock">{farm.machines.map((machine) => { const def = MACHINES[machine.type]; const seconds = machine.job ? timeLeft(machine.job.readyAt, now) : 0; const isFeed = machine.type === "feed-mill"; const productionProgress = machine.job?.startedAt ? Math.min(100, Math.max(0, Math.round((now - machine.job.startedAt) / (machine.job.readyAt - machine.job.startedAt) * 100))) : seconds === 0 && machine.job ? 100 : 0; return <div className={`machine-chip${machine.job ? seconds ? " working" : " ready" : " idle"}`} key={machine.id}><div className="mill-symbol">⚙</div><div className="mill-copy"><small>LEVEL {machine.level}</small><strong>{def.name}</strong><span>{machine.job ? seconds ? `Selesai ${seconds} dtk` : "Hasil siap diambil" : def.recipe}</span>{machine.job && <span className="machine-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={productionProgress} aria-label={`Progres ${def.name}`}><i style={{ width: `${productionProgress}%` }} /></span>}</div>{machine.job ? <button className="mill-button" type="button" disabled={seconds > 0} onClick={() => isFeed ? collectFeed(Date.now()) : useUiStore.getState().collectMachine(machine.id, Date.now())}>{seconds ? "Proses…" : "Ambil"}</button> : <button className="mill-button" type="button" onClick={() => isFeed ? startFeed(Date.now()) : useUiStore.getState().startMachine(machine.id, Date.now())}>Mulai</button>}<button className="upgrade-chip" type="button" aria-label={`Upgrade ${def.name}`} onClick={() => upgradeMachineById(machine.id)}>↑</button></div>; })}</div>
        </div>
      </section>
      <nav className="game-bottom-nav" aria-label="Navigasi kebun">{[["Tanam", "♧"], ["Bangun", "▤"], ["Produksi", "⚙"], ["Tas", "◇"], ["Misi", "☷"]].map(([tab, icon]) => <button key={tab} type="button" aria-pressed={activeTab === tab} onClick={() => selectBottomTab(tab)}><span aria-hidden="true">{icon}</span>{tab}</button>)}</nav>
      {barnOpen && <div className="shop-scrim" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setBarnOpen(false); }}><section className="shop-modal map-modal" role="dialog" aria-modal="true" aria-labelledby="barn-title"><header><div><p className="eyebrow">PETERNAKAN · {farm.animals.length}/12 HEWAN</p><h2 id="barn-title">Kandang & ternak</h2></div><button type="button" aria-label="Tutup kandang" onClick={() => setBarnOpen(false)}>×</button></header><div className="active-season-card"><span>🌾</span><div><strong>Pakan tersedia: {farm.animalFeed}</strong><small>Produksi berjalan selama kamu menjelajah wilayah lain. Satu pakan memulai satu siklus hasil.</small></div></div><div className="animal-card-grid">{farm.animals.map((animal) => { const def = ANIMALS[animal.type]; const seconds = animal.readyAt ? timeLeft(animal.readyAt, now) : 0; return <article className="animal-card" key={animal.id}><span className="animal-icon">{def.icon}</span><div><small>LEVEL {animal.level} · USIA {animal.ageDays} HARI</small><h3>{def.name}</h3><p>{animal.readyAt ? seconds ? `Menghasilkan ${def.productName.toLowerCase()} · ${seconds} dtk` : `${def.productName} siap diambil` : "Istirahat setelah siklus terakhir"}</p><button disabled={animal.readyAt ? seconds > 0 : farm.animalFeed < 1} onClick={() => animal.readyAt ? collectAnimalById(animal.id, Date.now()) : feedAnimalById(animal.id, Date.now())}>{animal.readyAt ? seconds ? "Sedang bekerja…" : `Ambil ${def.productName}` : "Beri 1 pakan"}</button></div></article>; })}</div><h3>Tambah ternak</h3><div className="shop-grid">{(Object.entries(ANIMALS) as [keyof typeof ANIMALS, typeof ANIMALS[keyof typeof ANIMALS]][]).map(([type, animal]) => <article key={type}><span className="shop-product">{animal.icon}</span><strong>{animal.name}</strong><small>{animal.productName} · setiap {Math.ceil(animal.cycleMs / 1000)} dtk · Level {animal.unlockLevel}</small><button disabled={level < animal.unlockLevel || farm.coins < animal.price} onClick={() => buyAnimalType(type)}>{level < animal.unlockLevel ? `Butuh level ${animal.unlockLevel}` : `Beli · ${animal.price} koin`}</button></article>)}</div></section></div>}
      {marketOpen && <div className="shop-scrim" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setMarketOpen(false); }}><section className="shop-modal map-modal" role="dialog" aria-modal="true" aria-labelledby="market-title"><header><div><p className="eyebrow">JUAL HASIL · GUDANG</p><h2 id="market-title">Pasar desa</h2></div><button type="button" aria-label="Tutup pasar" onClick={() => setMarketOpen(false)}>×</button></header><div className="warehouse-banner"><div><strong>Gudang {storageUsed} / {farm.storageCapacity} slot</strong><span className="warehouse-track"><i style={{ width: `${Math.min(100, storageUsed / farm.storageCapacity * 100)}%` }} /></span></div><button disabled={farm.storageCapacity >= 5000 || farm.coins < warehouseCost} onClick={expandWarehouse}>+40 slot · {warehouseCost} koin</button></div><article className="town-order"><div><small>PESANAN HARI {marketOrder.day + 1}</small><strong>{marketOrder.good.icon} {marketOrder.amount} {marketOrder.good.name}</strong><span>Bonus pesanan · +{marketOrder.reward} koin · +8 XP · +1 hati</span></div><button disabled={marketOrder.completed || (farm[marketOrder.good.key] as number) < marketOrder.amount} onClick={() => deliverOrderToMarket(Date.now())}>{marketOrder.completed ? "Selesai ✓" : `Kirim ${marketOrder.good.name}`}</button></article><div className="market-grid">{MARKET_GOODS.map((good) => { const amount = farm[good.key] as number; return <article key={String(good.key)}><span>{good.icon}</span><div><strong>{good.name}</strong><small>{amount} tersedia · {good.price} koin / unit</small></div><button disabled={amount < 1} onClick={() => sellGoodsFromMarket(good.key, amount)}>Jual semua · {amount * good.price}</button></article>; })}</div></section></div>}
      {mapPanelOpen && <div className="shop-scrim" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setMapPanelOpen(false); }}><section className="shop-modal map-modal" role="dialog" aria-modal="true" aria-labelledby="map-title"><header><div><p className="eyebrow">EKSPEDISI & MUSIM</p><h2 id="map-title">Peta dunia</h2></div><button type="button" aria-label="Tutup peta dunia" onClick={() => setMapPanelOpen(false)}>×</button></header><div className="active-season-card"><span>{WEATHER[weather].icon}</span><div><strong>{activeMap.name} · {SEASON_LABELS[season]} · {WEATHER[weather].name}</strong><small>Hari {seasonDay(activeMap, seasonStartedAt, now)} dari {activeMap.seasonProfile.durationDays} · {WEATHER[weather].description} · 1 hari game = 3 menit nyata</small></div><b>{activeMap.seasonProfile.mode === "zoned" ? "ZONA MUSIM" : `${activeMap.seasonProfile.seasons.length} MUSIM`}</b></div><div className="map-card-grid">{MAPS.map((map, index) => { const unlocked = unlockedMapIds.includes(map.id); const isActive = map.id === activeMapId; const previous = MAPS[index - 1]; const previousProgress = previous ? getMapProgress(farm, previous.id) : 100; const eligible = level >= map.unlockLevel && previousProgress >= map.progressRequired && farm.missionIndex >= map.missionMilestone; const progress = getMapProgress(farm, map.id); return <article className={`world-map-card${isActive ? " current" : ""}`} key={map.id}><div className={`world-map-art theme-${map.theme}`}><span>{mapIcon(map.id)}</span><b>{String(index + 1).padStart(2, "0")}</b></div><div className="world-map-copy"><small>{map.subtitle}</small><h3>{map.name}</h3><p>Level {map.unlockLevel} · {map.seasonProfile.mode === "zoned" ? "Musim berbeda per zona" : map.seasonProfile.seasons.map((item) => SEASON_LABELS[item]).join(" · ")}</p><div className="map-progress-track"><i style={{ width: `${progress}%` }} /></div><small>Pengembangan {progress}% · misi cerita {map.missionMilestone || "awal"}</small>{isActive ? <button disabled>Sedang dikunjungi</button> : unlocked ? <button onClick={() => { travelMap(map.id, Date.now()); setMapPanelOpen(false); }}>Kunjungi wilayah</button> : eligible ? <button onClick={() => unlockWorldMap(map.id)}>Buka ekspedisi</button> : <button disabled>{level < map.unlockLevel ? `Butuh level ${map.unlockLevel}` : previousProgress < map.progressRequired ? `Map sebelumnya ${map.progressRequired}%` : `Selesaikan misi ${map.missionMilestone}`}</button>}</div></article>; })}</div></section></div>}
      {shopOpen && <div className="shop-scrim" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShopOpen(false); }}><section className="shop-modal" role="dialog" aria-modal="true" aria-labelledby="shop-title"><header><div><p className="eyebrow">PASAR {activeMap.name.toUpperCase()}</p><h2 id="shop-title">Toko kebun</h2></div><button type="button" aria-label="Tutup toko" onClick={() => setShopOpen(false)}>×</button></header><p className="shop-wallet">✿ {farm.coins} koin · gudang {storageUsed}/{farm.storageCapacity}</p><h3>Benih wilayah ini</h3><div className="shop-grid">{activeMap.cropIds.map((item) => { const crop = item as CropId; return <article key={crop}><span className="shop-product">{cropEmoji(crop)}</span><strong>{CROPS[crop].name}</strong><small>{CROPS[crop].seedCost || 2} koin / benih · {CROPS[crop].growMs / 1000} dtk · level {CROP_UNLOCK_LEVEL[crop]}</small><button disabled={level < CROP_UNLOCK_LEVEL[crop] || farm.coins < (CROPS[crop].seedCost || 2) * 3 || storageUsed + 3 > farm.storageCapacity} onClick={() => buySeeds(crop, 3)}>{level < CROP_UNLOCK_LEVEL[crop] ? `Terbuka Lv ${CROP_UNLOCK_LEVEL[crop]}` : "Beli 3 benih"}</button></article>; })}</div><h3>Perluasan</h3><div className="shop-grid">{frontierTiles(farm.plots).slice(0, 4).map(([x, z]) => <article key={`${x}:${z}`}><span className="shop-product">▧</span><strong>Lahan baru</strong><small>Petak tersambung ({x}, {z})</small><button disabled={farm.plots.length >= activeMap.maxPlots} onClick={() => buyLandTile(x, z)}>Buka lahan · {30 + Math.max(0, farm.plots.length - 4) * 12} koin</button></article>)}</div><h3>Kandang dan peternakan</h3><div className="shop-grid">{(Object.keys(BARNS) as BarnId[]).map((type) => { const def = BARNS[type]; return <article key={type}><span className="shop-product">{def.icon}</span><strong>{def.name}</strong><small>Kapasitas {def.capacity} · tapak {def.footprint[0]}×{def.footprint[1]} · level {def.unlockLevel}</small><button disabled={level < def.unlockLevel || farm.coins < def.price} title={level < def.unlockLevel ? `Butuh level ${def.unlockLevel}` : farm.coins < def.price ? `Butuh ${def.price} koin` : "Dibangun di lahan kosong"} onClick={() => buildBarn(type)}>{level < def.unlockLevel ? `Terbuka Lv ${def.unlockLevel}` : `Bangun · ${def.price} koin`}</button></article>; })}</div><h3>Mesin & dapur produksi</h3><div className="shop-grid">{(Object.keys(MACHINES) as MachineId[]).filter((type) => type !== "feed-mill").map((type) => <article key={type}><span className="shop-product">⚙</span><strong>{MACHINES[type].name}</strong><small>{MACHINES[type].recipe} · Lv {MACHINES[type].level}</small><button disabled={farm.machines.some((machine) => machine.type === type) || level < MACHINES[type].level || farm.coins < MACHINES[type].price} onClick={() => buyMachineType(type)}>{farm.machines.some((machine) => machine.type === type) ? "Sudah dimiliki" : level < MACHINES[type].level ? `Terbuka Lv ${MACHINES[type].level}` : `Beli · ${MACHINES[type].price} koin`}</button></article>)}</div></section></div>}
      {hydrated && !farm.tutorialComplete && <div className="tutorial-scrim"><section className="tutorial-dialog" role="dialog" aria-modal="true" aria-labelledby="tutorial-title"><div className="tutorial-portrait">R</div><div><p className="eyebrow">ROSCO · TUTORIAL {farm.tutorialStep + 1}/8</p><h2 id="tutorial-title">{tutorialLines[farm.tutorialStep]?.title ?? "Selamat berkebun!"}</h2><p>{tutorialLines[farm.tutorialStep]?.text ?? "Kebunmu siap tumbuh."}</p><div className="tutorial-actions"><button className="text-button" onClick={() => setTutorial(8, true)}>Lewati tutorial</button><button className="action-button" onClick={() => setTutorial(farm.tutorialStep + 1, farm.tutorialStep >= 7)}>{farm.tutorialStep >= 7 ? "Mulai berkebun" : "Lanjut"} →</button></div></div></section></div>}
      <footer className="game-footer"><span>GREEN FARM STUDIO <i>·</i> LEVEL 1–100</span><span>PROGRES DISIMPAN DI PERANGKAT INI <b>♥</b></span></footer>
    </main>
  );
}
