import { create } from "zustand";
import {
  INITIAL_FARM,
  buyAnimal,
  buyBarn,
  clearRock,
  collectFeed,
  claimMission,
  claimSideMission,
  buySeed,
  buyLand,
  buyMachine,
  upgradeMachine,
  upgradeBarn,
  moveBarn,
  movePlot,
  moveMachine,
  plantCrop,
  startMachineJob,
  collectMachineOutput,
  collectAnimalProduct,
  feedAnimal,
  sellGoods,
  deliverTownOrder,
  upgradeWarehouse,
  unlockMap,
  travelToMap,
  deliverFeedOrder,
  harvestWheat,
  loadFarmSave,
  plantWheat,
  startFeedJob,
  type FarmSave,
  type CropId,
  type MachineId,
  type AnimalId,
  type BarnId,
} from "@/game/state/farm-rules";
import type { MapId } from "@/game/state/worlds";

const SAVE_KEY = "green-farm-save-v1";

type UiState = {
  farm: FarmSave;
  selectedPlot: string | null;
  message: string;
  hydrated: boolean;
  setSelectedPlot: (plot: string | null) => void;
  hydrate: () => void;
  clear: (plotId: string) => void;
  plant: (plotId: string, now: number) => void;
  harvest: (plotId: string, now: number) => void;
  startFeed: (now: number) => void;
  collectFeed: (now: number) => void;
  deliverOrder: () => void;
  claim: () => void;
  claimSide: (id: string) => void;
  buySeeds: (crop: CropId, amount: number) => void;
  buyLandTile: (x: number, z: number) => void;
  buyMachineType: (type: MachineId) => void;
  upgradeMachineById: (id: string) => void;
  movePlotBy: (id: string, dx: number, dz: number) => void;
  moveMachineTo: (id: string, x: number, z: number, rotation?: number) => void;
  moveBarnTo: (id: string, x: number, z: number, rotation?: number) => void;
  plantCropOnPlot: (plotId: string, crop: CropId, now: number) => void;
  startMachine: (id: string, now: number) => void;
  collectMachine: (id: string, now: number) => void;
  buyAnimalType: (type: AnimalId) => void;
  buyBarnType: (type: BarnId) => void;
  upgradeBarnById: (id: string) => void;
  feedAnimalById: (id: string, now: number) => void;
  collectAnimalById: (id: string, now: number) => void;
  sellGoodsFromMarket: (key: keyof FarmSave, amount: number) => void;
  deliverOrderToMarket: (now: number) => void;
  expandWarehouse: () => void;
  setTutorial: (step: number, complete?: boolean) => void;
  unlockWorldMap: (id: MapId) => void;
  travelMap: (id: MapId, now: number) => void;
  reset: () => void;
};

function persist(farm: FarmSave) {
  if (typeof window !== "undefined") window.localStorage.setItem(SAVE_KEY, JSON.stringify(farm));
}

export const useUiStore = create<UiState>((set, get) => {
  function apply(next: { farm: FarmSave; message: string }) {
    persist(next.farm);
    set({ farm: next.farm, message: next.message });
  }

  return {
    farm: structuredClone(INITIAL_FARM),
    selectedPlot: null,
    message: "Bersihkan batu, tanam gandum, lalu kirim pakan ke Rosco.",
    hydrated: false,
    setSelectedPlot: (selectedPlot) => set({ selectedPlot }),
    hydrate: () => {
      if (get().hydrated || typeof window === "undefined") return;
      const raw = window.localStorage.getItem(SAVE_KEY);
      const farm = loadFarmSave(raw);
      if (farm.seasonStartedAt === 0) farm.seasonStartedAt = Date.now();
      if (!raw) persist(farm);
      set({ farm, hydrated: true });
    },
    clear: (plotId) => apply(clearRock(get().farm, plotId)),
    plant: (plotId, now) => apply(plantWheat(get().farm, plotId, now)),
    harvest: (plotId, now) => apply(harvestWheat(get().farm, plotId, now)),
    startFeed: (now) => apply(startFeedJob(get().farm, now)),
    collectFeed: (now) => apply(collectFeed(get().farm, now)),
    deliverOrder: () => apply(deliverFeedOrder(get().farm)),
    claim: () => apply(claimMission(get().farm)),
    claimSide: (id) => apply(claimSideMission(get().farm, id)),
    buySeeds: (crop, amount) => apply(buySeed(get().farm, crop, amount)),
    buyLandTile: (x, z) => apply(buyLand(get().farm, x, z)),
    buyMachineType: (type) => apply(buyMachine(get().farm, type)),
    upgradeMachineById: (id) => apply(upgradeMachine(get().farm, id)),
    movePlotBy: (id, dx, dz) => apply(movePlot(get().farm, id, dx, dz)),
    moveMachineTo: (id, x, z, rotation) => apply(moveMachine(get().farm, id, x, z, rotation)),
    moveBarnTo: (id, x, z, rotation) => apply(moveBarn(get().farm, id, x, z, rotation)),
    plantCropOnPlot: (plotId, crop, now) => apply(plantCrop(get().farm, plotId, crop, now)),
    startMachine: (id, now) => apply(startMachineJob(get().farm, id, now)),
    collectMachine: (id, now) => apply(collectMachineOutput(get().farm, id, now)),
    buyAnimalType: (type) => apply(buyAnimal(get().farm, type)),
    buyBarnType: (type) => apply(buyBarn(get().farm, type)),
    upgradeBarnById: (id) => apply(upgradeBarn(get().farm, id)),
    feedAnimalById: (id, now) => apply(feedAnimal(get().farm, id, now)),
    collectAnimalById: (id, now) => apply(collectAnimalProduct(get().farm, id, now)),
    sellGoodsFromMarket: (key, amount) => apply(sellGoods(get().farm, key, amount)),
    deliverOrderToMarket: (now) => apply(deliverTownOrder(get().farm, now)),
    expandWarehouse: () => apply(upgradeWarehouse(get().farm)),
    setTutorial: (step, complete = false) => {
      const farm = { ...get().farm, tutorialStep: Math.max(0, Math.min(8, step)), tutorialComplete: complete };
      apply({ farm, message: complete ? "Tutorial selesai. Selamat berkebun!" : get().message });
    },
    unlockWorldMap: (id) => apply(unlockMap(get().farm, id)),
    travelMap: (id, now) => apply(travelToMap(get().farm, id, now)),
    reset: () => {
      const farm = structuredClone(INITIAL_FARM);
      farm.seasonStartedAt = Date.now();
      persist(farm);
      set({ farm, selectedPlot: null, message: "Kebun baru siap. Bersihkan batu untuk mulai.", hydrated: true });
    },
  };
});
