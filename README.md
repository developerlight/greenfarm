# Green Farm Web

Game simulasi kebun web single-player dengan aset visual buatan sendiri. Build lokal saat ini mencakup loop tanam/panen/produksi/pesanan, progression level 1–100, dan 100 misi utama dalam 10 bab. Timer memakai timestamp; progres disimpan pada browser.

## Teknologi

- Next.js App Router + React + TypeScript
- Three.js + React Three Fiber untuk kebun 3D isometrik
- Zustand untuk state aksi, localStorage save versi 2 dengan migrasi dari versi 1
- Supabase + `@supabase/ssr` client helpers disiapkan untuk tahap server, tetapi belum dikonfigurasi

## Jalankan lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:3000` lalu tekan tombol ke kebun atau akses `/game`.

## Cara bermain

1. Pilih petak A yang tertutup batu, lalu bersihkan.
2. Pilih petak tanah dan tanam gandum. Setelah 25 detik, panen memberi 3 gandum, 1 benih, 5 XP, dan 4 koin.
3. Masukkan 2 gandum ke mesin pakan; ambil 1 pakan setelah 12 detik.
4. Kirim pakan kepada Rosco untuk menyelesaikan permintaan dan memperoleh 30 koin, 12 XP, dan 1 hati.
5. Refresh halaman: progres dan timer dipulihkan. Tombol “Mulai ulang” menghapus save lokal setelah konfirmasi.
6. Ikuti misi utama pada panel misi; klaim hadiah untuk XP dan koin, lalu buka peta perjalanan 10 bab.

## Batas MVP

Aturan resep, jumlah hasil, harga/reward, kurva level, dan durasi uji adalah desain orisinal Green Farm Web, bukan klaim angka dari game asli. Save browser lokal tidak berotoritas server dan belum tersinkron lintas perangkat. Database sengaja ditunda; belum ada login, sistem ekonomi penuh, hewan interaktif, event, atau deployment online.

## Dokumen proyek

- [GDD MVP](docs/game-design.md)
- [Delivery plan dan status](docs/delivery-plan.md)
- [Gameplay evidence log](docs/gameplay-evidence-log.md)
- [Teknis/arsitektur](docs/architecture.md)
- [Art direction](docs/art-direction.md)
- [Manifest aset orisinal](docs/asset-manifest.md)
- [Backlog aset](docs/asset-production-backlog.md)
