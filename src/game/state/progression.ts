export type MissionAction = "clear" | "plant" | "harvest" | "feed" | "order";

export type Mission = {
  id: number;
  chapter: number;
  level: number;
  title: string;
  description: string;
  action: MissionAction;
  target: number;
  xp: number;
  coins: number;
};

const chapters = [
  "Tunas Pertama", "Ladang yang Mekar", "Panen Berlimpah", "Sahabat Kebun", "Musim Produktif",
  "Lembah Hijau", "Petani Andal", "Pasar Desa", "Kebun Impian", "Warisan Green Farm",
];
const missionSteps: { action: MissionAction; title: string; description: string }[] = [
  { action: "clear", title: "Buka lahan baru", description: "Bersihkan sebuah petak berbatu." },
  { action: "plant", title: "Mulai menanam", description: "Tanam gandum di petak kosong." },
  { action: "harvest", title: "Panen dengan cermat", description: "Panen gandum yang sudah matang." },
  { action: "feed", title: "Bantu mesin bekerja", description: "Ambil pakan dari mesin produksi." },
  { action: "order", title: "Jadi tetangga yang baik", description: "Kirim pesanan pakan kepada Rosco." },
];

export const MISSIONS: Mission[] = Array.from({ length: 100 }, (_, i) => {
  const step = i === 0 ? missionSteps[0] : missionSteps[((i - 1) % 4) + 1];
  const chapter = Math.floor(i / 10) + 1;
  const target = step.action === "plant" || step.action === "harvest" ? Math.floor(i / 20) + 1 : 1;
  return {
    id: i + 1,
    chapter,
    level: i + 1,
    title: `${step.title} ${String(i + 1).padStart(2, "0")}`,
    description: `${step.description}${target > 1 ? ` (${target} kali)` : ""}`,
    action: step.action,
    target,
    xp: 95 + chapter * 12,
    coins: 10 + chapter * 5,
  };
});

export const CHAPTERS = chapters.map((name, i) => ({
  number: i + 1,
  name,
  from: i * 10 + 1,
  to: (i + 1) * 10,
}));

export function levelForXp(xp: number): number {
  let level = 1;
  let remaining = xp;
  while (level < 100) {
    const needed = xpToNextLevel(level);
    if (remaining < needed) break;
    remaining -= needed;
    level += 1;
  }
  return level;
}

export function xpToNextLevel(level: number): number {
  return 60 + level * 2;
}

export function xpWithinLevel(xp: number): number {
  let remaining = xp;
  let level = 1;
  while (level < 100 && remaining >= xpToNextLevel(level)) {
    remaining -= xpToNextLevel(level);
    level += 1;
  }
  return remaining;
}

export function chapterName(level: number): string {
  return chapters[Math.min(9, Math.floor((level - 1) / 10))];
}
