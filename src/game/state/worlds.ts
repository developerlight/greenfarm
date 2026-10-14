export type MapId = "green-meadows" | "tropical-valley" | "autumn-woods" | "frostpeak-highlands" | "desert-oasis" | "coastal-islands";
export type SeasonId = "spring" | "summer" | "autumn" | "winter" | "wet" | "dry";
export type SeasonProfile = { mode: "cycle" | "zoned"; seasons: SeasonId[]; durationDays: number; zones?: { id: string; season: SeasonId; when: "west" | "east" }[] };
export type MapDefinition = {
  id: MapId; name: string; subtitle: string; unlockLevel: number; progressRequired: number; missionMilestone: number; maxPlots: number;
  theme: string; cropIds: string[]; seasonProfile: SeasonProfile;
};

export const GAME_DAY_MS = 3 * 60_000;
export const MAPS: MapDefinition[] = [
  { id: "green-meadows", name: "Green Meadows", subtitle: "Padang rumput awal", unlockLevel: 1, progressRequired: 0, missionMilestone: 0, maxPlots: 10, theme: "meadow", cropIds: ["wheat", "carrot", "tomato", "corn", "onion", "strawberry"], seasonProfile: { mode: "cycle", seasons: ["spring", "summer", "autumn", "winter"], durationDays: 7 } },
  { id: "tropical-valley", name: "Tropical Valley", subtitle: "Lembah hangat dan lembap", unlockLevel: 8, progressRequired: 80, missionMilestone: 10, maxPlots: 10, theme: "tropical", cropIds: ["pineapple", "coconut", "tomato", "lemon", "olive"], seasonProfile: { mode: "cycle", seasons: ["wet", "dry"], durationDays: 7 } },
  { id: "autumn-woods", name: "Autumn Woods", subtitle: "Hutan buah berwarna tembaga", unlockLevel: 15, progressRequired: 80, missionMilestone: 20, maxPlots: 10, theme: "autumn", cropIds: ["wheat", "blueberry", "pumpkin", "apple", "apricot", "mushroom"], seasonProfile: { mode: "cycle", seasons: ["summer", "autumn", "winter", "spring"], durationDays: 7 } },
  { id: "frostpeak-highlands", name: "Frostpeak Highlands", subtitle: "Punggung gunung dan lembah hijau", unlockLevel: 24, progressRequired: 80, missionMilestone: 30, maxPlots: 10, theme: "frostpeak", cropIds: ["potato", "blueberry", "wheat", "mushroom", "onion"], seasonProfile: { mode: "zoned", seasons: ["winter", "spring"], durationDays: 7, zones: [{ id: "snowline", season: "winter", when: "west" }, { id: "sunny-slope", season: "spring", when: "east" }] } },
  { id: "desert-oasis", name: "Desert Oasis", subtitle: "Kebun tumbuh di sisi oasis", unlockLevel: 34, progressRequired: 80, missionMilestone: 40, maxPlots: 10, theme: "desert", cropIds: ["cactus-fruit", "pumpkin", "coconut", "lemon", "olive"], seasonProfile: { mode: "cycle", seasons: ["dry", "wet"], durationDays: 7 } },
  { id: "coastal-islands", name: "Coastal Islands", subtitle: "Pulau kecil di tepi laut", unlockLevel: 45, progressRequired: 80, missionMilestone: 50, maxPlots: 10, theme: "coastal", cropIds: ["coconut", "pineapple", "tomato", "strawberry", "lemon"], seasonProfile: { mode: "cycle", seasons: ["wet", "dry"], durationDays: 7 } },
];

export const SEASON_LABELS: Record<SeasonId, string> = { spring: "Musim Semi", summer: "Musim Panas", autumn: "Musim Gugur", winter: "Musim Dingin", wet: "Musim Hujan", dry: "Musim Kemarau" };
export const SEASON_COLORS: Record<SeasonId, { sky: string; grass: string; soil: string; accent: string }> = {
  spring: { sky: "#d9ebcc", grass: "#8cc665", soil: "#b5794d", accent: "#77ad68" }, summer: { sky: "#cde9e7", grass: "#83b85b", soil: "#b87c4b", accent: "#e4bd69" },
  autumn: { sky: "#ead8b8", grass: "#bcaa62", soil: "#a86e47", accent: "#c97b4d" }, winter: { sky: "#d4e4ed", grass: "#d5e2d4", soil: "#9a9b8c", accent: "#e9f2f3" },
  wet: { sky: "#b9d9d9", grass: "#63a96d", soil: "#986b4e", accent: "#78bfc4" }, dry: { sky: "#ecd8ac", grass: "#b5a85c", soil: "#c18b50", accent: "#edc775" },
};

export function seasonAt(map: MapDefinition, startedAt: number, now: number, x?: number): SeasonId {
  if (map.seasonProfile.mode === "zoned") return x === undefined || x < 0 ? (map.seasonProfile.zones?.[0]?.season ?? map.seasonProfile.seasons[0]) : (map.seasonProfile.zones?.[1]?.season ?? map.seasonProfile.seasons[1] ?? map.seasonProfile.seasons[0]);
  const seasonMs = map.seasonProfile.durationDays * GAME_DAY_MS;
  const seasonIndex = Math.floor(Math.max(0, now - startedAt) / seasonMs) % map.seasonProfile.seasons.length;
  return map.seasonProfile.seasons[seasonIndex] ?? "spring";
}

export function seasonDay(map: MapDefinition, startedAt: number, now: number): number {
  return Math.floor(Math.max(0, now - startedAt) / GAME_DAY_MS) % map.seasonProfile.durationDays + 1;
}

export function mapProgressPercent(plotCount: number, machineCount: number, maxPlots: number): number {
  const landScore = Math.min(1, plotCount / maxPlots) * 70;
  const facilityScore = Math.min(1, machineCount / 3) * 30;
  return Math.round(landScore + facilityScore);
}
