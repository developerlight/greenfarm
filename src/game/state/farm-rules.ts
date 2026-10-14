import { z } from "zod";
import { MISSIONS, levelForXp, type MissionAction } from "@/game/state/progression";
import { GAME_DAY_MS, MAPS, mapProgressPercent, seasonAt, type MapId, type SeasonId } from "@/game/state/worlds";

export type CropId = "wheat" | "carrot" | "tomato" | "pineapple" | "coconut" | "blueberry" | "pumpkin" | "potato" | "cactus-fruit" | "corn" | "onion" | "strawberry" | "apple" | "lemon" | "apricot" | "olive" | "mushroom";
export const CROPS: Record<CropId, { name: string; seedCost: number; growMs: number; yield: number; price: number; xp: number; color: string; seasons: SeasonId[] }> = {
  wheat: { name: "Gandum", seedCost: 0, growMs: 25_000, yield: 3, price: 8, xp: 5, color: "#d4b455", seasons: ["spring", "summer", "autumn", "winter", "wet", "dry"] },
  carrot: { name: "Wortel", seedCost: 5, growMs: 45_000, yield: 2, price: 13, xp: 8, color: "#e68b48", seasons: ["spring", "autumn", "wet"] },
  tomato: { name: "Tomat", seedCost: 9, growMs: 70_000, yield: 2, price: 18, xp: 11, color: "#d96b5c", seasons: ["summer", "wet", "dry"] },
  pineapple: { name: "Nanas", seedCost: 12, growMs: 85_000, yield: 2, price: 24, xp: 14, color: "#d8b84d", seasons: ["wet", "summer"] },
  coconut: { name: "Kelapa", seedCost: 16, growMs: 100_000, yield: 2, price: 30, xp: 17, color: "#8b7653", seasons: ["wet", "dry", "summer"] },
  blueberry: { name: "Blueberry", seedCost: 14, growMs: 90_000, yield: 3, price: 26, xp: 15, color: "#6b6fae", seasons: ["summer", "autumn", "spring"] },
  pumpkin: { name: "Labu", seedCost: 10, growMs: 80_000, yield: 2, price: 22, xp: 13, color: "#db8a3d", seasons: ["autumn", "dry"] },
  potato: { name: "Kentang", seedCost: 11, growMs: 75_000, yield: 3, price: 19, xp: 12, color: "#b99461", seasons: ["spring", "winter"] },
  "cactus-fruit": { name: "Buah Kaktus", seedCost: 18, growMs: 110_000, yield: 2, price: 34, xp: 18, color: "#d96d77", seasons: ["dry", "summer"] },
  corn: { name: "Jagung", seedCost: 7, growMs: 60_000, yield: 3, price: 15, xp: 9, color: "#e6c459", seasons: ["summer", "wet", "dry"] },
  onion: { name: "Bawang", seedCost: 8, growMs: 65_000, yield: 3, price: 16, xp: 10, color: "#bd7a8b", seasons: ["spring", "autumn", "wet"] },
  strawberry: { name: "Stroberi", seedCost: 13, growMs: 82_000, yield: 2, price: 25, xp: 14, color: "#d94c5b", seasons: ["spring", "summer"] },
  apple: { name: "Apel", seedCost: 17, growMs: 105_000, yield: 3, price: 32, xp: 18, color: "#cf5f4e", seasons: ["autumn", "spring"] },
  lemon: { name: "Lemon", seedCost: 15, growMs: 90_000, yield: 2, price: 29, xp: 16, color: "#e5d95c", seasons: ["summer", "dry"] },
  apricot: { name: "Aprikot", seedCost: 16, growMs: 95_000, yield: 2, price: 30, xp: 17, color: "#e99d5b", seasons: ["spring", "summer"] },
  olive: { name: "Zaitun", seedCost: 19, growMs: 115_000, yield: 3, price: 36, xp: 20, color: "#77884d", seasons: ["summer", "dry"] },
  mushroom: { name: "Jamur", seedCost: 12, growMs: 72_000, yield: 3, price: 23, xp: 13, color: "#bc9a77", seasons: ["autumn", "winter", "wet"] },
};
export const CROP_UNLOCK_LEVEL: Record<CropId, number> = { wheat: 1, carrot: 1, tomato: 2, corn: 3, onion: 4, strawberry: 7, pineapple: 8, coconut: 10, blueberry: 12, pumpkin: 13, potato: 14, "cactus-fruit": 34, apple: 15, lemon: 16, apricot: 18, olive: 22, mushroom: 24 };
export type WeatherId = "sunny" | "rain" | "wind" | "storm" | "heat" | "snow";
export const WEATHER: Record<WeatherId, { name: string; icon: string; growFactor: number; description: string }> = {
  sunny: { name: "Cerah", icon: "☀", growFactor: 0.94, description: "Cuaca cerah mempercepat pertumbuhan sedikit." },
  rain: { name: "Hujan", icon: "☂", growFactor: 0.88, description: "Hujan menyirami kebun dan membantu tanaman tumbuh." },
  wind: { name: "Berangin", icon: "〰", growFactor: 1, description: "Angin menggerakkan pepohonan; semua aktivitas tetap berjalan." },
  storm: { name: "Badai", icon: "⚡", growFactor: 1.06, description: "Badai hanya mengubah suasana. Tanaman dan mesin tetap aman." },
  heat: { name: "Panas", icon: "♨", growFactor: 1.12, description: "Panas memperlambat pertumbuhan sedikit; hasil panen tidak rusak." },
  snow: { name: "Salju", icon: "❄", growFactor: 1.08, description: "Salju memperlambat tanaman yang masih bisa ditanam." },
};
export type MachineId = "feed-mill" | "flour-mill" | "bakery" | "juice-press" | "dairy" | "jam-kitchen" | "oil-press" | "manor-kitchen";
export type MachineInputId = CropId | "flour" | "milk";
export type MachineOutputId = "animalFeed" | "flour" | "bread" | "juice" | "butter" | "jam" | "oliveOil" | "pumpkinSoup";
export const MACHINES: Record<MachineId, { name: string; price: number; recipe: string; input: Partial<Record<MachineInputId, number>>; output: MachineOutputId; outputCount: number; duration: number; level: number }> = {
  "feed-mill": { name: "Mesin Pakan", price: 0, recipe: "2 gandum → 1 pakan", input: { wheat: 2 }, output: "animalFeed", outputCount: 1, duration: 12_000, level: 1 },
  "flour-mill": { name: "Penggilingan Tepung", price: 125, recipe: "3 gandum → 1 tepung", input: { wheat: 3 }, output: "flour", outputCount: 1, duration: 20_000, level: 3 },
  bakery: { name: "Toko Roti", price: 185, recipe: "2 tepung → 1 roti", input: { flour: 2 }, output: "bread", outputCount: 1, duration: 24_000, level: 5 },
  "juice-press": { name: "Pengepres Jus", price: 235, recipe: "2 apel → 1 jus", input: { apple: 2 }, output: "juice", outputCount: 1, duration: 32_000, level: 7 },
  dairy: { name: "Dapur Susu", price: 275, recipe: "2 susu → 1 mentega", input: { milk: 2 }, output: "butter", outputCount: 1, duration: 36_000, level: 11 },
  "jam-kitchen": { name: "Dapur Selai", price: 310, recipe: "2 stroberi → 1 selai", input: { strawberry: 2 }, output: "jam", outputCount: 1, duration: 40_000, level: 15 },
  "oil-press": { name: "Pengepres Minyak", price: 380, recipe: "3 zaitun → 1 minyak", input: { olive: 3 }, output: "oliveOil", outputCount: 1, duration: 48_000, level: 22 },
  "manor-kitchen": { name: "Dapur Manor", price: 450, recipe: "2 labu + 1 susu → 1 sup", input: { pumpkin: 2, milk: 1 }, output: "pumpkinSoup", outputCount: 1, duration: 52_000, level: 25 },
};

export type PlotState = { id: string; x: number; z: number; kind: "blocked" | "soil" | "growing" | "ready"; crop?: CropId; plantedAt?: number; readyAt?: number };
export type MachineState = { id: string; type: MachineId; x: number; z: number; rotation?: number; level: number; job: { startedAt?: number; readyAt: number } | null };
export type AnimalId = "chicken" | "cow" | "goat" | "duck" | "bee" | "sheep" | "pig" | "dog" | "horse";
export const ANIMALS: Record<AnimalId, { name: string; icon: string; price: number; unlockLevel: number; cycleMs: number; product: "eggs" | "milk" | "honey" | "wool" | "truffles" | null; productName: string; productPrice: number }> = {
  chicken: { name: "Ayam", icon: "🐔", price: 55, unlockLevel: 1, cycleMs: 45_000, product: "eggs", productName: "Telur", productPrice: 18 },
  cow: { name: "Sapi", icon: "🐄", price: 180, unlockLevel: 5, cycleMs: 90_000, product: "milk", productName: "Susu", productPrice: 42 },
  goat: { name: "Kambing", icon: "🐐", price: 145, unlockLevel: 10, cycleMs: 75_000, product: "milk", productName: "Susu", productPrice: 36 },
  duck: { name: "Bebek", icon: "🦆", price: 105, unlockLevel: 8, cycleMs: 60_000, product: "eggs", productName: "Telur", productPrice: 23 },
  bee: { name: "Lebah", icon: "🐝", price: 220, unlockLevel: 16, cycleMs: 110_000, product: "honey", productName: "Madu", productPrice: 58 },
  sheep: { name: "Domba", icon: "🐑", price: 205, unlockLevel: 18, cycleMs: 105_000, product: "wool", productName: "Wol", productPrice: 55 },
  pig: { name: "Babi", icon: "🐖", price: 245, unlockLevel: 20, cycleMs: 115_000, product: "truffles", productName: "Truffle", productPrice: 68 },
  dog: { name: "Anjing penjaga", icon: "🐕", price: 95, unlockLevel: 4, cycleMs: 35_000, product: null, productName: "Ikatan", productPrice: 0 },
  horse: { name: "Kuda", icon: "🐎", price: 340, unlockLevel: 28, cycleMs: 55_000, product: null, productName: "Ikatan", productPrice: 0 },
};
export type AnimalState = { id: string; type: AnimalId; level: number; fedAt: number | null; readyAt: number | null; ageDays: number; barnId?: string };
export type BarnId = "chicken-coop" | "cattle-barn" | "small-animal-pen" | "apiary" | "stable";
export type BarnState = { id: string; type: BarnId; x: number; z: number; rotation: number; level: number };
export const BARNS: Record<BarnId, { name: string; price: number; unlockLevel: number; capacity: number; footprint: [number, number]; animals: AnimalId[]; icon: string }> = {
  "chicken-coop": { name: "Kandang Ayam", price: 0, unlockLevel: 1, capacity: 15, footprint: [2, 2], animals: ["chicken", "duck"], icon: "🐔" },
  "cattle-barn": { name: "Kandang Sapi", price: 220, unlockLevel: 5, capacity: 8, footprint: [3, 2], animals: ["cow"], icon: "🐄" },
  "small-animal-pen": { name: "Kandang Ternak Kecil", price: 180, unlockLevel: 10, capacity: 10, footprint: [2, 2], animals: ["goat", "sheep", "pig"], icon: "🐐" },
  apiary: { name: "Rumah Lebah", price: 250, unlockLevel: 16, capacity: 6, footprint: [1, 1], animals: ["bee"], icon: "🐝" },
  stable: { name: "Kandang Kuda", price: 390, unlockLevel: 28, capacity: 4, footprint: [3, 2], animals: ["horse", "dog"], icon: "🐎" },
};
export const barnForAnimal = (animal: AnimalId): BarnId => animal === "chicken" || animal === "duck" ? "chicken-coop" : animal === "cow" ? "cattle-barn" : animal === "bee" ? "apiary" : animal === "horse" || animal === "dog" ? "stable" : "small-animal-pen";
export type SideMissionState = { id: string; progress: number; claimed: boolean };
export type MapFarmState = { plots: PlotState[]; machines: MachineState[]; barns: BarnState[]; seasonStartedAt: number };
export type FarmSave = {
  version: 4; coins: number; xp: number; seeds: number; wheat: number; animalFeed: number; hearts: number;
  carrots: number; carrotSeeds: number; tomatoes: number; tomatoSeeds: number; bread: number; juice: number;
  plots: PlotState[]; machines: MachineState[]; barns: BarnState[]; orderDelivered: boolean; missionIndex: number; missionProgress: number;
  sideMissions: SideMissionState[]; tutorialStep: number; tutorialComplete: boolean; nextId: number;
  activeMapId: MapId; unlockedMapIds: MapId[]; mapStates: Partial<Record<MapId, MapFarmState>>; seasonStartedAt: number;
  pineapples: number; pineappleSeeds: number; coconuts: number; coconutSeeds: number; blueberries: number; blueberrySeeds: number; pumpkins: number; pumpkinSeeds: number; potatoes: number; potatoSeeds: number; cactusFruits: number; cactusFruitSeeds: number;
  corn: number; cornSeeds: number; onions: number; onionSeeds: number; strawberries: number; strawberrySeeds: number; apples: number; appleSeeds: number; lemons: number; lemonSeeds: number; apricots: number; apricotSeeds: number; olives: number; oliveSeeds: number; mushrooms: number; mushroomSeeds: number;
  animals: AnimalState[]; eggs: number; milk: number; honey: number; wool: number; truffles: number; storageCapacity: number; flour: number; butter: number; jam: number; oliveOil: number; pumpkinSoup: number;
  townOrderDay: number;
};

const PlotSchema = z.object({ id: z.string().min(1), x: z.number().int(), z: z.number().int(), kind: z.enum(["blocked", "soil", "growing", "ready"]), crop: z.enum(["wheat", "carrot", "tomato", "pineapple", "coconut", "blueberry", "pumpkin", "potato", "cactus-fruit", "corn", "onion", "strawberry", "apple", "lemon", "apricot", "olive", "mushroom"]).optional(), plantedAt: z.number().finite().optional(), readyAt: z.number().finite().optional() });
const MachineSchema = z.object({ id: z.string().min(1), type: z.enum(["feed-mill", "flour-mill", "bakery", "juice-press", "dairy", "jam-kitchen", "oil-press", "manor-kitchen"]), x: z.number().int(), z: z.number().int(), rotation: z.number().int().min(0).max(3).optional(), level: z.number().int().min(1).max(10), job: z.object({ startedAt: z.number().finite().optional(), readyAt: z.number().finite() }).nullable() });
const BarnSchema = z.object({ id: z.string().min(1), type: z.enum(["chicken-coop", "cattle-barn", "small-animal-pen", "apiary", "stable"]), x: z.number().int(), z: z.number().int(), rotation: z.number().int().min(0).max(3), level: z.number().int().min(1).max(10) });
const AnimalSchema = z.object({ id: z.string().min(1), type: z.enum(["chicken", "cow", "goat", "duck", "bee", "sheep", "pig", "dog", "horse"]), level: z.number().int().min(1).max(10), fedAt: z.number().finite().nullable(), readyAt: z.number().finite().nullable(), ageDays: z.number().int().nonnegative(), barnId: z.string().optional() });
const MapIds = z.enum(["green-meadows", "tropical-valley", "autumn-woods", "frostpeak-highlands", "desert-oasis", "coastal-islands"]);
const MapFarmSchema = z.object({ plots: z.array(PlotSchema).min(1).max(500), machines: z.array(MachineSchema).max(100), barns: z.array(BarnSchema).max(100).default([]), seasonStartedAt: z.number().finite() });
const FarmSaveSchema = z.object({ version: z.literal(4), coins: z.number().int().nonnegative(), xp: z.number().int().nonnegative(), seeds: z.number().int().nonnegative(), wheat: z.number().int().nonnegative(), animalFeed: z.number().int().nonnegative(), hearts: z.number().int().nonnegative(), carrots: z.number().int().nonnegative(), carrotSeeds: z.number().int().nonnegative(), tomatoes: z.number().int().nonnegative(), tomatoSeeds: z.number().int().nonnegative(), pineapples: z.number().int().nonnegative(), pineappleSeeds: z.number().int().nonnegative(), coconuts: z.number().int().nonnegative(), coconutSeeds: z.number().int().nonnegative(), blueberries: z.number().int().nonnegative(), blueberrySeeds: z.number().int().nonnegative(), pumpkins: z.number().int().nonnegative(), pumpkinSeeds: z.number().int().nonnegative(), potatoes: z.number().int().nonnegative(), potatoSeeds: z.number().int().nonnegative(), cactusFruits: z.number().int().nonnegative(), cactusFruitSeeds: z.number().int().nonnegative(), corn: z.number().int().nonnegative(), cornSeeds: z.number().int().nonnegative(), onions: z.number().int().nonnegative(), onionSeeds: z.number().int().nonnegative(), strawberries: z.number().int().nonnegative(), strawberrySeeds: z.number().int().nonnegative(), apples: z.number().int().nonnegative(), appleSeeds: z.number().int().nonnegative(), lemons: z.number().int().nonnegative(), lemonSeeds: z.number().int().nonnegative(), apricots: z.number().int().nonnegative(), apricotSeeds: z.number().int().nonnegative(), olives: z.number().int().nonnegative(), oliveSeeds: z.number().int().nonnegative(), mushrooms: z.number().int().nonnegative(), mushroomSeeds: z.number().int().nonnegative(), animals: z.array(AnimalSchema).max(100), eggs: z.number().int().nonnegative(), milk: z.number().int().nonnegative(), honey: z.number().int().nonnegative(), wool: z.number().int().nonnegative(), truffles: z.number().int().nonnegative(), storageCapacity: z.number().int().min(40).max(5000), flour: z.number().int().nonnegative(), butter: z.number().int().nonnegative(), jam: z.number().int().nonnegative(), oliveOil: z.number().int().nonnegative(), pumpkinSoup: z.number().int().nonnegative(), townOrderDay: z.number().int().min(-1), bread: z.number().int().nonnegative(), juice: z.number().int().nonnegative(), plots: z.array(PlotSchema).min(1).max(500), machines: z.array(MachineSchema).max(100), barns: z.array(BarnSchema).max(100).default([]), orderDelivered: z.boolean(), missionIndex: z.number().int().min(0).max(100), missionProgress: z.number().int().nonnegative(), sideMissions: z.array(z.object({ id: z.string(), progress: z.number().int().nonnegative(), claimed: z.boolean() })), tutorialStep: z.number().int().min(0).max(8), tutorialComplete: z.boolean(), nextId: z.number().int().positive(), activeMapId: MapIds, unlockedMapIds: z.array(MapIds), mapStates: z.partialRecord(MapIds, MapFarmSchema), seasonStartedAt: z.number().finite() });

export const CROP_GROW_MS = CROPS.wheat.growMs;
export const FEED_MILL_MS = MACHINES["feed-mill"].duration;
export const FEED_RECIPE_WHEAT = 2;
export const SIDE_MISSIONS = [
  { id: "plant-carrot", title: "Warna di kebun", description: "Tanam wortel 2 kali", action: "plant-carrot", target: 2, xp: 18, coins: 24 },
  { id: "expand-land", title: "Perluas halaman", description: "Beli satu petak lahan", action: "expand", target: 1, xp: 24, coins: 32 },
  { id: "harvest-crops", title: "Panen berlimpah", description: "Panen tanaman 3 kali", action: "harvest", target: 3, xp: 20, coins: 28 },
  { id: "care-for-animals", title: "Teman di kandang", description: "Beri pakan pada ternak 2 kali", action: "feed-animal", target: 2, xp: 24, coins: 30 },
  { id: "collect-products", title: "Hasil segar", description: "Kumpulkan hasil ternak 2 kali", action: "collect-product", target: 2, xp: 28, coins: 36 },
  { id: "market-sales", title: "Hari pasar", description: "Jual barang di pasar 2 kali", action: "sell-good", target: 2, xp: 24, coins: 40 },
  { id: "run-machines", title: "Roda produksi", description: "Ambil hasil mesin 2 kali", action: "machine-output", target: 2, xp: 34, coins: 42 },
  { id: "warehouse-expansion", title: "Gudang lapang", description: "Perluas kapasitas gudang", action: "expand-warehouse", target: 1, xp: 35, coins: 40 },
] as const;

export const INITIAL_FARM: FarmSave = {
  version: 4, coins: 40, xp: 0, seeds: 3, wheat: 0, animalFeed: 0, hearts: 0, carrots: 0, carrotSeeds: 0, tomatoes: 0, tomatoSeeds: 0, pineapples: 0, pineappleSeeds: 0, coconuts: 0, coconutSeeds: 0, blueberries: 0, blueberrySeeds: 0, pumpkins: 0, pumpkinSeeds: 0, potatoes: 0, potatoSeeds: 0, cactusFruits: 0, cactusFruitSeeds: 0, corn: 0, cornSeeds: 0, onions: 0, onionSeeds: 0, strawberries: 0, strawberrySeeds: 0, apples: 0, appleSeeds: 0, lemons: 0, lemonSeeds: 0, apricots: 0, apricotSeeds: 0, olives: 0, oliveSeeds: 0, mushrooms: 0, mushroomSeeds: 0, animals: [{ id: "animal-1", type: "chicken", level: 1, fedAt: null, readyAt: null, ageDays: 1, barnId: "barn-1" }], eggs: 0, milk: 0, honey: 0, wool: 0, truffles: 0, storageCapacity: 80, flour: 0, butter: 0, jam: 0, oliveOil: 0, pumpkinSoup: 0, townOrderDay: -1, bread: 0, juice: 0,
  plots: [{ id: "A", x: -1, z: 0, kind: "blocked" }, { id: "B", x: 0, z: 0, kind: "soil" }, { id: "C", x: -1, z: 1, kind: "soil" }, { id: "D", x: 0, z: 1, kind: "soil" }],
  machines: [{ id: "machine-1", type: "feed-mill", x: 0, z: -2, level: 1, job: null }], barns: [{ id: "barn-1", type: "chicken-coop", x: 2, z: -1, rotation: 0, level: 1 }], orderDelivered: false, missionIndex: 0, missionProgress: 0,
  sideMissions: SIDE_MISSIONS.map((mission) => ({ id: mission.id, progress: 0, claimed: false })), tutorialStep: 0, tutorialComplete: false, nextId: 2,
  activeMapId: "green-meadows", unlockedMapIds: ["green-meadows"], mapStates: {}, seasonStartedAt: 0,
};
export type FarmResult = { farm: FarmSave; message: string };
const result = (farm: FarmSave, message: string): FarmResult => ({ farm, message });
function progress(farm: FarmSave, action: MissionAction): Pick<FarmSave, "missionProgress"> { return { missionProgress: MISSIONS[farm.missionIndex]?.action === action ? farm.missionProgress + 1 : farm.missionProgress }; }
function sideProgress(farm: FarmSave, action: string): SideMissionState[] { return farm.sideMissions.map((state) => { const definition = SIDE_MISSIONS.find((mission) => mission.id === state.id); return definition?.action === action && !state.claimed ? { ...state, progress: Math.min(definition.target, state.progress + 1) } : state; }); }
const inventoryKeys: Record<CropId, [keyof FarmSave, keyof FarmSave]> = {
  wheat: ["seeds", "wheat"], carrot: ["carrotSeeds", "carrots"], tomato: ["tomatoSeeds", "tomatoes"], pineapple: ["pineappleSeeds", "pineapples"],
  coconut: ["coconutSeeds", "coconuts"], blueberry: ["blueberrySeeds", "blueberries"], pumpkin: ["pumpkinSeeds", "pumpkins"], potato: ["potatoSeeds", "potatoes"], "cactus-fruit": ["cactusFruitSeeds", "cactusFruits"],
  corn: ["cornSeeds", "corn"], onion: ["onionSeeds", "onions"], strawberry: ["strawberrySeeds", "strawberries"], apple: ["appleSeeds", "apples"], lemon: ["lemonSeeds", "lemons"], apricot: ["apricotSeeds", "apricots"], olive: ["oliveSeeds", "olives"], mushroom: ["mushroomSeeds", "mushrooms"],
};
export type ProductKey = "eggs" | "milk" | "honey" | "wool";
export const MARKET_GOODS: { key: keyof FarmSave; name: string; icon: string; price: number; type: "crop" | "product" | "crafted" }[] = [
  ...Object.entries(CROPS).map(([id, crop]) => ({ key: inventoryKeys[id as CropId][1], name: crop.name, icon: "🌿", price: crop.price, type: "crop" as const })),
  { key: "eggs", name: "Telur", icon: "🥚", price: 18, type: "product" }, { key: "milk", name: "Susu", icon: "🥛", price: 42, type: "product" }, { key: "honey", name: "Madu", icon: "🍯", price: 58, type: "product" }, { key: "wool", name: "Wol", icon: "🧶", price: 55, type: "product" }, { key: "truffles", name: "Truffle", icon: "🍄", price: 68, type: "product" },
  { key: "flour", name: "Tepung", icon: "🥣", price: 24, type: "crafted" }, { key: "butter", name: "Mentega", icon: "🧈", price: 59, type: "crafted" }, { key: "bread", name: "Roti", icon: "🍞", price: 48, type: "crafted" }, { key: "juice", name: "Jus", icon: "🧃", price: 52, type: "crafted" }, { key: "jam", name: "Selai", icon: "🍯", price: 61, type: "crafted" }, { key: "oliveOil", name: "Minyak zaitun", icon: "🫒", price: 78, type: "crafted" }, { key: "pumpkinSoup", name: "Sup labu", icon: "🥣", price: 76, type: "crafted" },
];
export function inventoryUsed(farm: FarmSave): number { return MARKET_GOODS.reduce((total, item) => total + (farm[item.key] as number), 0) + farm.animalFeed + Object.values(inventoryKeys).reduce((total, [seed]) => total + (farm[seed] as number), 0); }
export function getWeather(farm: FarmSave, now: number): WeatherId {
  const map = MAPS.find((item) => item.id === farm.activeMapId)!; const day = Math.floor(Math.max(0, now - (farm.seasonStartedAt || now)) / 180_000); const pattern: WeatherId[] = map.theme === "frostpeak" ? ["snow", "wind", "sunny", "snow", "storm"] : map.theme === "desert" ? ["heat", "sunny", "wind", "rain", "heat"] : map.theme === "tropical" || map.theme === "coastal" ? ["rain", "sunny", "wind", "storm", "rain"] : ["sunny", "rain", "wind", "sunny", "storm", "heat"];
  return pattern[day % pattern.length];
}
export function getTownOrder(farm: FarmSave, now: number) {
  const day = Math.floor(Math.max(0, now - (farm.seasonStartedAt || now)) / GAME_DAY_MS);
  const mapIndex = Math.max(0, MAPS.findIndex((map) => map.id === farm.activeMapId));
  const good = MARKET_GOODS[(day * 7 + mapIndex * 5) % MARKET_GOODS.length];
  const amount = 1 + day % 3;
  return { day, good, amount, reward: Math.round(good.price * amount * 1.5), completed: farm.townOrderDay === day };
}
function cropCount(farm: FarmSave, crop: CropId): number { return farm[inventoryKeys[crop][1]] as number; }
function seedCount(farm: FarmSave, crop: CropId): number { return farm[inventoryKeys[crop][0]] as number; }
function withInventory(farm: FarmSave, crop: CropId, seeds: number, produce: number): FarmSave { return { ...farm, [inventoryKeys[crop][0]]: seeds, [inventoryKeys[crop][1]]: produce }; }
export function getMapState(farm: FarmSave, id: MapId): MapFarmState {
  if (farm.activeMapId === id) return { plots: farm.plots, machines: farm.machines, barns: farm.barns, seasonStartedAt: farm.seasonStartedAt };
  const state = farm.mapStates[id] ?? defaultMapState(id, 0);
  return state.barns?.length ? state : { ...state, barns: defaultMapState(id, state.seasonStartedAt).barns };
}
function defaultMapState(id: MapId, startedAt: number): MapFarmState {
  const prefix = id === "green-meadows" ? "" : `${id}-`;
  return { plots: [{ id: `${prefix}A`, x: -1, z: 0, kind: "blocked" }, { id: `${prefix}B`, x: 0, z: 0, kind: "soil" }, { id: `${prefix}C`, x: -1, z: 1, kind: "soil" }, { id: `${prefix}D`, x: 0, z: 1, kind: "soil" }], machines: [{ id: `${id}-machine-1`, type: "feed-mill", x: 0, z: -2, level: 1, job: null }], barns: [{ id: `${id}-barn-1`, type: "chicken-coop", x: 2, z: -1, rotation: 0, level: 1 }], seasonStartedAt: startedAt };
}
export function getMapProgress(farm: FarmSave, id: MapId): number { const def = MAPS.find((map) => map.id === id)!; const state = getMapState(farm, id); return mapProgressPercent(state.plots.length, state.machines.length, def.maxPlots); }
export function getCurrentSeason(farm: FarmSave, now: number, x?: number): SeasonId { const map = MAPS.find((item) => item.id === farm.activeMapId)!; return seasonAt(map, farm.seasonStartedAt, now, x); }
export function unlockMap(farm: FarmSave, id: MapId): FarmResult {
  const index = MAPS.findIndex((map) => map.id === id); const definition = MAPS[index]; if (!definition) return result(farm, "Map tidak ditemukan."); if (farm.unlockedMapIds.includes(id)) return result(farm, "Map ini sudah terbuka.");
  const previous = MAPS[index - 1]; const priorProgress = previous ? getMapProgress(farm, previous.id) : 100;
  if (levelForXp(farm.xp) < definition.unlockLevel) return result(farm, `Map terbuka pada level ${definition.unlockLevel}.`);
  if (priorProgress < definition.progressRequired) return result(farm, `Kembangkan ${previous?.name ?? "map sebelumnya"} hingga ${definition.progressRequired}%. Saat ini ${priorProgress}%.`);
  if (farm.missionIndex < definition.missionMilestone) return result(farm, `Selesaikan misi cerita ${definition.missionMilestone} untuk ekspedisi wilayah ini.`);
  return result({ ...farm, unlockedMapIds: [...farm.unlockedMapIds, id], mapStates: { ...farm.mapStates, [id]: defaultMapState(id, Date.now()) } }, `${definition.name} ditemukan dan sekarang terbuka!`);
}
export function travelToMap(farm: FarmSave, id: MapId, now: number): FarmResult {
  if (!farm.unlockedMapIds.includes(id)) return result(farm, "Selesaikan syarat ekspedisi untuk membuka map ini."); if (farm.activeMapId === id) return result(farm, `Kamu sudah berada di ${MAPS.find((map) => map.id === id)?.name}.`);
  const oldState: MapFarmState = { plots: farm.plots, machines: farm.machines, barns: farm.barns, seasonStartedAt: farm.seasonStartedAt || now };
  const target = farm.mapStates[id] ?? defaultMapState(id, now);
  return result({ ...farm, activeMapId: id, plots: target.plots, machines: target.machines, barns: farm.barns, seasonStartedAt: target.seasonStartedAt || now, mapStates: { ...farm.mapStates, [farm.activeMapId]: oldState, [id]: { ...target, barns: farm.barns, seasonStartedAt: target.seasonStartedAt || now } } }, `Tiba di ${MAPS.find((map) => map.id === id)?.name}.`);
}

export function clearRock(farm: FarmSave, plotId: string): FarmResult {
  const plot = farm.plots.find((item) => item.id === plotId);
  if (!plot || plot.kind !== "blocked") return result(farm, "Petak ini tidak perlu dibersihkan.");
  return result({ ...farm, ...progress(farm, "clear"), plots: farm.plots.map((item) => item.id === plotId ? { ...item, kind: "soil" } : item) }, `Batu di petak ${plotId} berhasil dibersihkan.`);
}
export function plantCrop(farm: FarmSave, plotId: string, crop: CropId, now: number): FarmResult {
  const plot = farm.plots.find((item) => item.id === plotId);
  if (!plot || plot.kind !== "soil") return result(farm, "Pilih petak kosong untuk menanam.");
  if (seedCount(farm, crop) < 1) return result(farm, `Benih ${CROPS[crop].name.toLowerCase()} habis. Beli benih di toko.`);
  const map = MAPS.find((item) => item.id === farm.activeMapId)!;
  if (levelForXp(farm.xp) < CROP_UNLOCK_LEVEL[crop]) return result(farm, `${CROPS[crop].name} terbuka pada level ${CROP_UNLOCK_LEVEL[crop]}.`);
  if (!map.cropIds.includes(crop)) return result(farm, `${CROPS[crop].name} tidak tumbuh di wilayah ini. Kunjungi map lain.`);
  const season = seasonAt(map, farm.seasonStartedAt || now, now, plot.x);
  if (!CROPS[crop].seasons.includes(season)) return result(farm, `${CROPS[crop].name} tidak cocok ditanam saat ${season.toLowerCase()}.`);
  const weather = WEATHER[getWeather(farm, now)];
  const planted: PlotState = { ...plot, kind: "growing", crop, plantedAt: now, readyAt: now + Math.max(1_000, Math.round(CROPS[crop].growMs * weather.growFactor)) };
  return result({ ...withInventory(farm, crop, seedCount(farm, crop) - 1, cropCount(farm, crop)), ...progress(farm, "plant"), sideMissions: sideProgress(farm, `plant-${crop}`), plots: farm.plots.map((item) => item.id === plotId ? planted : item) }, `${CROPS[crop].name} ditanam. Siap dalam ${Math.ceil(CROPS[crop].growMs / 1000)} detik.`);
}
export const plantWheat = (farm: FarmSave, plotId: string, now: number) => plantCrop(farm, plotId, "wheat", now);
export function harvestWheat(farm: FarmSave, plotId: string, now: number): FarmResult {
  const plot = farm.plots.find((item) => item.id === plotId);
  if (!plot || (plot.kind !== "ready" && (plot.kind !== "growing" || now < (plot.readyAt ?? 0)))) return result(farm, "Tanaman belum siap dipanen.");
  const crop = plot.crop ?? "wheat"; const definition = CROPS[crop]; if (inventoryUsed(farm) + definition.yield + 1 > farm.storageCapacity) return result(farm, "Gudang penuh. Jual barang di pasar atau perluas gudang dulu."); const next = withInventory(farm, crop, seedCount(farm, crop) + 1, cropCount(farm, crop) + definition.yield);
  return result({ ...next, ...progress(farm, "harvest"), sideMissions: sideProgress(farm, "harvest"), xp: farm.xp + definition.xp, plots: farm.plots.map((item) => item.id === plotId ? { id: plotId, x: item.x, z: item.z, kind: "soil" } : item) }, `Panen ${definition.name.toLowerCase()}: +${definition.yield}, +1 benih.`);
}
export function clearRockLegacy(farm: FarmSave, plotId: string): FarmResult { return clearRock(farm, plotId); }
export function startMachineJob(farm: FarmSave, machineId: string, now: number): FarmResult {
  const machine = farm.machines.find((item) => item.id === machineId); if (!machine) return result(farm, "Mesin tidak ditemukan."); if (machine.job) return result(farm, `${MACHINES[machine.type].name} sedang bekerja.`);
  const definition = MACHINES[machine.type]; if (Object.entries(definition.input).some(([item, count]) => Number(farm[item as keyof FarmSave]) < (count ?? 0))) return result(farm, `Bahan belum cukup. Resep: ${definition.recipe}.`);
  let next = { ...farm }; for (const [item, count] of Object.entries(definition.input)) { if (item in inventoryKeys) next = withInventory(next, item as CropId, seedCount(next, item as CropId), cropCount(next, item as CropId) - (count ?? 0)); else next = { ...next, [item]: Number(next[item as keyof FarmSave]) - (count ?? 0) }; }
  return result({ ...next, machines: next.machines.map((item) => item.id === machineId ? { ...item, job: { startedAt: now, readyAt: now + definition.duration / (1 + (machine.level - 1) * 0.12) } } : item) }, `${definition.name} mulai bekerja.`);
}
export function collectMachineOutput(farm: FarmSave, machineId: string, now: number): FarmResult {
  const machine = farm.machines.find((item) => item.id === machineId); if (!machine?.job) return result(farm, "Tidak ada hasil untuk diambil."); if (now < machine.job.readyAt) return result(farm, "Produksi masih berjalan.");
  const output = MACHINES[machine.type].output; if (inventoryUsed(farm) + 1 > farm.storageCapacity) return result(farm, "Gudang penuh. Jual barang di pasar atau perluas gudang dulu."); const next = { ...farm, [output]: farm[output] + MACHINES[machine.type].outputCount };
  return result({ ...next, ...progress(farm, "feed"), sideMissions: sideProgress(farm, "machine-output"), xp: farm.xp + 3, machines: farm.machines.map((item) => item.id === machineId ? { ...item, job: null } : item) }, `${MACHINES[machine.type].name}: hasil produksi siap.`);
}
export const startFeedJob = (farm: FarmSave, now: number) => { const machine = farm.machines.find((item) => item.type === "feed-mill"); return machine ? startMachineJob(farm, machine.id, now) : result(farm, "Tidak ada Mesin Pakan di map ini."); };
export const collectFeed = (farm: FarmSave, now: number) => { const machine = farm.machines.find((item) => item.type === "feed-mill"); return machine ? collectMachineOutput(farm, machine.id, now) : result(farm, "Tidak ada Mesin Pakan di map ini."); };
export function deliverFeedOrder(farm: FarmSave): FarmResult {
  if (farm.orderDelivered) return result(farm, "Pesanan Rosco sudah diselesaikan."); if (farm.animalFeed < 1) return result(farm, "Rosco membutuhkan 1 pakan ternak.");
  return result({ ...farm, ...progress(farm, "order"), animalFeed: farm.animalFeed - 1, coins: farm.coins + 30, xp: farm.xp + 12, hearts: farm.hearts + 1, orderDelivered: true }, "Pesanan Rosco terkirim: +30 koin, +12 XP, +1 hati.");
}
export function claimMission(farm: FarmSave): FarmResult {
  const mission = MISSIONS[farm.missionIndex]; if (!mission) return result(farm, "Semua misi utama sudah selesai. Level 100 tercapai."); if (farm.missionProgress < mission.target) return result(farm, "Selesaikan target misi sebelum mengambil hadiah.");
  const nextMission = MISSIONS[farm.missionIndex + 1]; const next = { ...farm, missionIndex: farm.missionIndex + 1, missionProgress: 0, orderDelivered: nextMission?.action === "order" ? false : farm.orderDelivered, xp: farm.xp + mission.xp, coins: farm.coins + mission.coins };
  return result(next, `${mission.title} selesai: +${mission.xp} XP, +${mission.coins} koin.${levelForXp(next.xp) > levelForXp(farm.xp) ? ` Naik ke level ${levelForXp(next.xp)}!` : ""}`);
}
export function claimSideMission(farm: FarmSave, id: string): FarmResult {
  const def = SIDE_MISSIONS.find((item) => item.id === id); const state = farm.sideMissions.find((item) => item.id === id); if (!def || !state || state.claimed || state.progress < def.target) return result(farm, "Target misi sampingan belum selesai.");
  return result({ ...farm, sideMissions: farm.sideMissions.map((item) => item.id === id ? { ...item, claimed: true } : item), xp: farm.xp + def.xp, coins: farm.coins + def.coins }, `Misi ${def.title} selesai: +${def.xp} XP, +${def.coins} koin.`);
}
export function buySeed(farm: FarmSave, crop: CropId, amount: number): FarmResult {
  if (levelForXp(farm.xp) < CROP_UNLOCK_LEVEL[crop]) return result(farm, `${CROPS[crop].name} terbuka pada level ${CROP_UNLOCK_LEVEL[crop]}.`);
  if (!MAPS.find((map) => map.id === farm.activeMapId)?.cropIds.includes(crop)) return result(farm, `Benih ${CROPS[crop].name.toLowerCase()} hanya tersedia di wilayah lain.`);
  const costPer = crop === "wheat" ? 2 : CROPS[crop].seedCost; const cost = costPer * amount; if (!Number.isInteger(amount) || amount < 1 || farm.coins < cost) return result(farm, "Koin tidak cukup untuk membeli benih.");
  if (inventoryUsed(farm) + amount > farm.storageCapacity) return result(farm, "Gudang tidak cukup. Perluas kapasitas sebelum membeli benih.");
  return result(withInventory({ ...farm, coins: farm.coins - cost }, crop, seedCount(farm, crop) + amount, cropCount(farm, crop)), `${amount} benih ${CROPS[crop].name.toLowerCase()} dibeli.`);
}
export function buyAnimal(farm: FarmSave, type: AnimalId): FarmResult {
  const definition = ANIMALS[type]; if (levelForXp(farm.xp) < definition.unlockLevel) return result(farm, `${definition.name} terbuka pada level ${definition.unlockLevel}.`);
  const barnType = barnForAnimal(type); const compatible = farm.barns.filter((item) => item.type === barnType); if (!compatible.length) return result(farm, `Bangun ${BARNS[barnType].name.toLowerCase()} terlebih dahulu.`);
  const barn = compatible.find((item) => { const housed = farm.animals.filter((animal) => animal.barnId === item.id || (!animal.barnId && item.type === "chicken-coop")).length; return housed < BARNS[item.type].capacity + (item.level - 1) * 5; });
  if (!barn) return result(farm, `${BARNS[barnType].name} penuh. Upgrade atau bangun kandang lain.`); if (farm.coins < definition.price) return result(farm, `Perlu ${definition.price} koin untuk membeli ${definition.name.toLowerCase()}.`);
  const animal: AnimalState = { id: `animal-${farm.nextId}`, type, level: 1, fedAt: null, readyAt: null, ageDays: 1, barnId: barn.id };
  return result({ ...farm, coins: farm.coins - definition.price, nextId: farm.nextId + 1, animals: [...farm.animals, animal] }, `${definition.name} bergabung dengan peternakan.`);
}
export function feedAnimal(farm: FarmSave, id: string, now: number): FarmResult {
  const animal = farm.animals.find((item) => item.id === id); if (!animal) return result(farm, "Hewan tidak ditemukan."); if (animal.readyAt && animal.readyAt <= now) return result(farm, "Hasilnya siap dikumpulkan sebelum diberi pakan lagi."); if (animal.readyAt && animal.readyAt > now) return result(farm, `${ANIMALS[animal.type].name} masih berproduksi.`); if (farm.animalFeed < 1) return result(farm, "Pakan habis. Buat pakan di Feed Mill.");
  const duration = ANIMALS[animal.type].cycleMs / (1 + (animal.level - 1) * 0.1);
  return result({ ...farm, animalFeed: farm.animalFeed - 1, sideMissions: sideProgress(farm, "feed-animal"), animals: farm.animals.map((item) => item.id === id ? { ...item, fedAt: now, readyAt: now + duration } : item) }, `${ANIMALS[animal.type].name} diberi pakan. Hasil siap dalam ${Math.ceil(duration / 1000)} detik.`);
}
export function collectAnimalProduct(farm: FarmSave, id: string, now: number): FarmResult {
  const animal = farm.animals.find((item) => item.id === id); if (!animal?.readyAt) return result(farm, "Hewan ini belum diberi pakan."); if (now < animal.readyAt) return result(farm, "Hasil ternak belum siap."); const definition = ANIMALS[animal.type]; if (definition.product && inventoryUsed(farm) + 1 > farm.storageCapacity) return result(farm, "Gudang penuh. Jual barang di pasar dulu."); const goods = definition.product ? { [definition.product]: farm[definition.product] + 1 } : { hearts: farm.hearts + 1 };
  return result({ ...farm, ...goods, xp: farm.xp + 4, sideMissions: sideProgress(farm, "collect-product"), animals: farm.animals.map((item) => item.id === id ? { ...item, readyAt: null, fedAt: null, ageDays: item.ageDays + 1 } : item) }, definition.product ? `${definition.productName} berhasil dikumpulkan.` : `${definition.name} mendapat perhatianmu. +1 hati persahabatan.`);
}
export function sellGoods(farm: FarmSave, key: keyof FarmSave, amount: number): FarmResult {
  const good = MARKET_GOODS.find((item) => item.key === key); if (!good || !Number.isInteger(amount) || amount < 1) return result(farm, "Barang atau jumlah penjualan tidak valid."); const available = farm[key]; if (typeof available !== "number" || available < amount) return result(farm, `Stok ${good.name.toLowerCase()} tidak cukup.`);
  return result({ ...farm, [key]: available - amount, coins: farm.coins + good.price * amount, xp: farm.xp + Math.max(1, Math.floor(amount / 2)), sideMissions: sideProgress(farm, "sell-good") }, `${amount} ${good.name.toLowerCase()} terjual seharga ${good.price * amount} koin.`);
}
export function deliverTownOrder(farm: FarmSave, now: number): FarmResult {
  const order = getTownOrder(farm, now); if (order.completed) return result(farm, "Pesanan pasar hari ini sudah selesai. Pesanan baru datang besok."); const stock = farm[order.good.key];
  if (typeof stock !== "number" || stock < order.amount) return result(farm, `Pasar memerlukan ${order.amount} ${order.good.name.toLowerCase()}. Stokmu belum cukup.`);
  return result({ ...farm, [order.good.key]: stock - order.amount, coins: farm.coins + order.reward, xp: farm.xp + 8, hearts: farm.hearts + 1, townOrderDay: order.day, sideMissions: sideProgress(farm, "sell-good") }, `Pesanan pasar: ${order.amount} ${order.good.name.toLowerCase()} dikirim. +${order.reward} koin, +8 XP.`);
}
export function upgradeWarehouse(farm: FarmSave): FarmResult {
  if (farm.storageCapacity >= 5000) return result(farm, "Gudang mencapai kapasitas maksimum."); const cost = Math.round((farm.storageCapacity - 40) * 1.4 + 120); if (farm.coins < cost) return result(farm, `Perlu ${cost} koin untuk memperluas gudang.`);
  return result({ ...farm, coins: farm.coins - cost, storageCapacity: Math.min(5000, farm.storageCapacity + 40), sideMissions: sideProgress(farm, "expand-warehouse") }, `Gudang diperluas menjadi ${Math.min(5000, farm.storageCapacity + 40)} slot.`);
}
export function buyLand(farm: FarmSave, x: number, z: number): FarmResult {
  if (farm.plots.some((p) => p.x === x && p.z === z)) return result(farm, "Petak sudah dimiliki."); if (!farm.plots.some((p) => Math.abs(p.x - x) + Math.abs(p.z - z) === 1)) return result(farm, "Perluasan harus menyambung dengan lahan milikmu.");
  const map = MAPS.find((item) => item.id === farm.activeMapId)!; if (farm.plots.length >= map.maxPlots) return result(farm, `${map.name} sudah mencapai batas area ${map.maxPlots} petak.`);
  const cost = 30 + Math.max(0, farm.plots.length - 4) * 12; if (farm.coins < cost) return result(farm, `Perlu ${cost} koin untuk membuka petak ini.`);
  const id = `plot-${farm.nextId}`; return result({ ...farm, coins: farm.coins - cost, nextId: farm.nextId + 1, plots: [...farm.plots, { id, x, z, kind: "soil" }], sideMissions: sideProgress(farm, "expand") }, `Petak baru dibeli seharga ${cost} koin.`);
}
export function movePlot(farm: FarmSave, id: string, dx: number, dz: number): FarmResult {
  const plot = farm.plots.find((p) => p.id === id); if (!plot) return result(farm, "Petak tidak ditemukan."); const x = plot.x + dx; const z = plot.z + dz;
  if (farm.plots.some((p) => p.id !== id && p.x === x && p.z === z) || farm.machines.some((m) => x >= m.x && x < m.x + machineFootprint(m.type) && z >= m.z && z < m.z + machineFootprint(m.type)) || farm.barns.some((barn) => { const [width, height] = barnFootprint(barn.type, barn.rotation); return x >= barn.x && x < barn.x + width && z >= barn.z && z < barn.z + height; })) return result(farm, "Lokasi sudah ditempati.");
  if (!farm.plots.some((p) => p.id !== id && Math.abs(p.x - x) + Math.abs(p.z - z) === 1)) return result(farm, "Petak harus tetap tersambung ke kebun.");
  return result({ ...farm, plots: farm.plots.map((p) => p.id === id ? { ...p, x, z } : p) }, `Petak dipindahkan ke (${x}, ${z}).`);
}
export function machineFootprint(type: MachineId): number { return type === "bakery" || type === "manor-kitchen" ? 2 : 1; }
export function barnFootprint(type: BarnId, rotation = 0): [number, number] { const [width, height] = BARNS[type].footprint; return rotation % 2 ? [height, width] : [width, height]; }
function overlaps(x: number, z: number, width: number, height: number, otherX: number, otherZ: number, otherWidth: number, otherHeight: number): boolean { return x < otherX + otherWidth && x + width > otherX && z < otherZ + otherHeight && z + height > otherZ; }
export function machinePlacementError(farm: FarmSave, type: MachineId, x: number, z: number, ignoreId?: string): string | null {
  const size = machineFootprint(type);
  for (let dx = 0; dx < size; dx++) for (let dz = 0; dz < size; dz++) {
    const tileX = x + dx; const tileZ = z + dz;
    if (farm.plots.some((plot) => plot.x === tileX && plot.z === tileZ)) return "Area bersinggungan dengan petak kebun.";
    const blocker = farm.machines.find((machine) => machine.id !== ignoreId && tileX >= machine.x && tileX < machine.x + machineFootprint(machine.type) && tileZ >= machine.z && tileZ < machine.z + machineFootprint(machine.type));
    if (blocker) return `Area bertabrakan dengan ${MACHINES[blocker.type].name}.`;
  }
  if (farm.barns.some((barn) => overlaps(x, z, size, size, barn.x, barn.z, ...barnFootprint(barn.type, barn.rotation)))) return "Area bersinggungan dengan bangunan peternakan.";
  return null;
}
export function barnPlacementError(farm: FarmSave, type: BarnId, x: number, z: number, rotation = 0, ignoreId?: string): string | null {
  const [width, height] = barnFootprint(type, rotation);
  for (let dx = 0; dx < width; dx++) for (let dz = 0; dz < height; dz++) {
    const tileX = x + dx; const tileZ = z + dz;
    if (farm.plots.some((plot) => plot.x === tileX && plot.z === tileZ)) return "Area bersinggungan dengan petak kebun.";
    if (farm.machines.some((machine) => tileX >= machine.x && tileX < machine.x + machineFootprint(machine.type) && tileZ >= machine.z && tileZ < machine.z + machineFootprint(machine.type))) return "Area bersinggungan dengan mesin produksi.";
  }
  if (farm.barns.some((barn) => barn.id !== ignoreId && overlaps(x, z, width, height, barn.x, barn.z, ...barnFootprint(barn.type, barn.rotation)))) return "Area bersinggungan dengan kandang lain.";
  return null;
}
export function moveMachine(farm: FarmSave, id: string, x: number, z: number, rotation?: number): FarmResult {
  const machine = farm.machines.find((item) => item.id === id);
  if (!machine) return result(farm, "Mesin tidak ditemukan.");
  if (!Number.isInteger(x) || !Number.isInteger(z)) return result(farm, "Posisi mesin harus mengikuti petak grid.");
  const error = machinePlacementError(farm, machine.type, x, z, id);
  if (error) return result(farm, error);
  const normalizedRotation = ((rotation ?? machine.rotation ?? 0) % 4 + 4) % 4;
  return result({ ...farm, machines: farm.machines.map((item) => item.id === id ? { ...item, x, z, rotation: normalizedRotation } : item) }, `${MACHINES[machine.type].name} dipindahkan ke (${x}, ${z}).`);
}
export function moveBarn(farm: FarmSave, id: string, x: number, z: number, rotation?: number): FarmResult {
  const barn = farm.barns.find((item) => item.id === id);
  if (!barn) return result(farm, "Kandang tidak ditemukan.");
  const nextRotation = ((rotation ?? barn.rotation) % 4 + 4) % 4;
  const error = barnPlacementError(farm, barn.type, x, z, nextRotation, id);
  if (error) return result(farm, error);
  return result({ ...farm, barns: farm.barns.map((item) => item.id === id ? { ...item, x, z, rotation: nextRotation } : item) }, `${BARNS[barn.type].name} dipindahkan ke (${x}, ${z}).`);
}
export function buyBarn(farm: FarmSave, type: BarnId): FarmResult {
  const def = BARNS[type];
  if (levelForXp(farm.xp) < def.unlockLevel) return result(farm, `${def.name} terbuka pada level ${def.unlockLevel}.`);
  if (farm.coins < def.price) return result(farm, `Perlu ${def.price} koin untuk membangun ${def.name.toLowerCase()}.`);
  let found: [number, number] | null = null;
  const startX = Math.max(0, ...farm.plots.map((plot) => plot.x + 1), ...farm.machines.map((machine) => machine.x + machineFootprint(machine.type)), ...farm.barns.map((barn) => barn.x + barnFootprint(barn.type, barn.rotation)[0]));
  for (let x = startX; x < startX + 80 && !found; x++) for (let z = -4; z <= 4; z++) if (!barnPlacementError(farm, type, x, z)) { found = [x, z]; break; }
  if (!found) return result(farm, "Belum ada lahan kosong yang cukup. Perluas area terlebih dahulu.");
  const barn: BarnState = { id: `barn-${farm.nextId}`, type, x: found[0], z: found[1], rotation: 0, level: 1 };
  return result({ ...farm, coins: farm.coins - def.price, barns: [...farm.barns, barn], nextId: farm.nextId + 1 }, `${def.name} dibangun di lahan (${barn.x}, ${barn.z}).`);
}
export function upgradeBarn(farm: FarmSave, id: string): FarmResult {
  const barn = farm.barns.find((item) => item.id === id);
  if (!barn) return result(farm, "Kandang tidak ditemukan.");
  if (barn.level >= 10) return result(farm, "Kandang sudah mencapai level maksimum.");
  const cost = barn.level * 110;
  if (farm.coins < cost) return result(farm, `Perlu ${cost} koin untuk upgrade kandang.`);
  return result({ ...farm, coins: farm.coins - cost, barns: farm.barns.map((item) => item.id === id ? { ...item, level: item.level + 1 } : item) }, `${BARNS[barn.type].name} naik ke level ${barn.level + 1}; kapasitas bertambah.`);
}
export function buyMachine(farm: FarmSave, type: MachineId): FarmResult {
  const def = MACHINES[type]; if (farm.machines.some((m) => m.type === type)) return result(farm, "Mesin ini sudah dimiliki."); if (levelForXp(farm.xp) < def.level) return result(farm, `Mesin terbuka pada level ${def.level}.`); if (farm.coins < def.price) return result(farm, `Perlu ${def.price} koin untuk membeli mesin ini.`);
  let x = Math.max(...farm.plots.map((p) => p.x)) + 1 + farm.machines.length; const z = 0;
  while (machinePlacementError(farm, type, x, z)) x += 1;
  return result({ ...farm, coins: farm.coins - def.price, machines: [...farm.machines, { id: `machine-${farm.nextId}`, type, x, z, level: 1, job: null }], nextId: farm.nextId + 1 }, `${def.name} dibeli. Atur posisinya di kebun.`);
}
export function upgradeMachine(farm: FarmSave, id: string): FarmResult {
  const machine = farm.machines.find((m) => m.id === id); if (!machine) return result(farm, "Mesin tidak ditemukan."); if (machine.level >= 10) return result(farm, "Mesin sudah mencapai level maksimum."); const cost = machine.level * 80; if (farm.coins < cost) return result(farm, `Perlu ${cost} koin untuk upgrade.`);
  return result({ ...farm, coins: farm.coins - cost, machines: farm.machines.map((m) => m.id === id ? { ...m, level: m.level + 1 } : m) }, `${MACHINES[machine.type].name} naik ke level ${machine.level + 1}.`);
}
export function cropProgress(plot: PlotState, now: number): number { if (plot.kind === "ready") return 1; if (plot.kind !== "growing") return 0; return Math.min(1, Math.max(0, (now - (plot.plantedAt ?? now)) / Math.max(1, (plot.readyAt ?? now) - (plot.plantedAt ?? now)))); }
export function isCropReady(plot: PlotState, now: number): boolean { return plot.kind === "ready" || (plot.kind === "growing" && now >= (plot.readyAt ?? Infinity)); }
export function timeLeft(readyAt: number | undefined, now: number): number { return readyAt === undefined ? 0 : Math.max(0, Math.ceil((readyAt - now) / 1000)); }
export function loadFarmSave(raw: string | null): FarmSave {
  if (!raw) return structuredClone(INITIAL_FARM);
  try {
    const parsed: unknown = JSON.parse(raw); const current = FarmSaveSchema.safeParse(parsed); if (current.success) { const data = current.data; return { ...data, barns: data.barns.length ? data.barns : structuredClone(INITIAL_FARM.barns), animals: data.animals.map((animal) => ({ ...animal, ...(animal.barnId ? {} : { barnId: data.barns[0]?.id ?? "barn-1" }) })), sideMissions: SIDE_MISSIONS.map((mission) => data.sideMissions.find((state) => state.id === mission.id) ?? { id: mission.id, progress: 0, claimed: false }) }; }
    if (typeof parsed === "object" && parsed !== null && "version" in parsed && (parsed.version === 1 || parsed.version === 2 || parsed.version === 3)) {
      const old = parsed as Partial<FarmSave> & { plots?: Array<Record<string, unknown>>; millJob?: { readyAt: number } | null };
      const base = structuredClone(INITIAL_FARM);
      const clearedStarterRock = Array.isArray(old.plots) && !old.plots.some((plot) => plot.kind === "blocked");
      if (Array.isArray(old.plots)) {
        const alreadyGrid = old.plots.length > 0 && old.plots.every((plot) => Number.isInteger(plot.x) && Number.isInteger(plot.z));
        base.plots = alreadyGrid
          ? old.plots as PlotState[]
          : old.plots.slice(0, 4).map((plot, i) => ({ id: String(plot.id ?? String.fromCharCode(65 + i)), x: [-1, 0, -1, 0][i], z: [0, 0, 1, 1][i], kind: ["blocked", "soil", "growing", "ready"].includes(String(plot.kind)) ? plot.kind as PlotState["kind"] : "soil", ...(plot.crop ? { crop: plot.crop as CropId } : { crop: "wheat" as CropId }), ...(typeof plot.plantedAt === "number" ? { plantedAt: plot.plantedAt } : {}), ...(typeof plot.readyAt === "number" ? { readyAt: plot.readyAt } : {}) }));
      }
      Object.assign(base, old, { version: 4, plots: base.plots, barns: Array.isArray(old.barns) && old.barns.length ? old.barns : base.barns, coins: old.coins ?? base.coins, xp: old.xp ?? 0, seeds: old.seeds ?? base.seeds, wheat: old.wheat ?? 0, animalFeed: old.animalFeed ?? 0, hearts: old.hearts ?? 0, carrots: old.carrots ?? 0, carrotSeeds: old.carrotSeeds ?? 0, tomatoes: old.tomatoes ?? 0, tomatoSeeds: old.tomatoSeeds ?? 0, bread: old.bread ?? 0, juice: old.juice ?? 0, machines: Array.isArray(old.machines) ? old.machines : base.machines, orderDelivered: old.orderDelivered ?? false, missionIndex: old.missionIndex ?? (clearedStarterRock ? 1 : 0), missionProgress: old.missionProgress ?? 0, sideMissions: Array.isArray(old.sideMissions) ? old.sideMissions : base.sideMissions, tutorialStep: old.tutorialStep ?? 8, tutorialComplete: old.tutorialComplete ?? true, nextId: old.nextId ?? 2, activeMapId: old.activeMapId ?? "green-meadows", unlockedMapIds: old.unlockedMapIds ?? ["green-meadows"], mapStates: old.mapStates ?? {}, seasonStartedAt: old.seasonStartedAt ?? 0 });
      base.animals = base.animals.map((animal) => ({ ...animal, ...(animal.barnId ? {} : { barnId: base.barns[0]?.id ?? "barn-1" }) }));
      if (old.millJob?.readyAt) base.machines[0].job = { readyAt: old.millJob.readyAt };
      base.sideMissions = SIDE_MISSIONS.map((mission) => base.sideMissions.find((state) => state.id === mission.id) ?? { id: mission.id, progress: 0, claimed: false });
      const checked = FarmSaveSchema.safeParse(base); if (checked.success) return checked.data;
    }
  } catch { /* Recover with a clean local farm if the save is invalid. */ }
  return structuredClone(INITIAL_FARM);
}
