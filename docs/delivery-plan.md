# Green Farm Web — Delivery Plan and Status

## Fase 1 — Referensi dan desain · selesai untuk MVP

- [x] Tinjau sampel video dan catat bukti, timestamp, confidence, dan batas analisis.
- [x] Catat ID video berulang: indeks 14 dan 15 sama-sama video Part 15; Part 14 unik belum diberikan.
- [x] Tetapkan vertical slice; bedakan evidence Green Farm 3 dari angka/desain orisinal di `game-design.md`.

## Fase 2 — Fondasi proyek · fondasi lokal selesai

- [x] Next.js App Router, React, TypeScript.
- [x] Three.js/React Three Fiber untuk scene 3D.
- [x] Zustand dan Zod untuk state/validasi local save.
- [x] Save browser versi 2; migrasi lokal versi 1 dan timer berbasis timestamp.
- [ ] Supabase Auth, migrasi, dan remote save: project ID/kredensial belum tersedia; CLI Supabase juga belum ada di environment. Tidak ada perubahan remote yang diterapkan.
- [ ] Vercel project/deploy: belum dikonfigurasi.

## Fase 3 — Prototipe dunia · selesai untuk MVP

- [x] Kamera isometrik, empat petak, tombol pemilih aksesibel.
- [x] Scene bereaksi pada status batu, tanah, gandum tumbuh, dan siap panen.
- [x] HUD, inventaris, aksi, mesin pakan, dan pesanan NPC.

## Fase 4 — Aturan gameplay · selesai untuk MVP

- [x] Bersihkan batu, tanam dan panen gandum.
- [x] Buat pakan dengan biaya bahan dan timer, lalu ambil hasilnya.
- [x] Kirim pesanan tetangga dengan validasi stok dan reward sekali.
- [x] Hitung sisa waktu dari timestamp saat tab dibuka kembali.
- [x] Progression XP/level lokal sampai level 100 dengan kurva bertahap.
- [x] 100 misi linear di 10 bab, hadiah XP/koin, target aksi, misi aktif dan peta progres di UI.
- [x] Pesanan Rosco dapat diulang pada misi pengiriman berikutnya; batu awal hanya menjadi misi satu kali.

## Fase 5 — Kualitas · pemeriksaan statis dan layout selesai, runtime browser terhambat

- [x] ESLint.
- [x] TypeScript `tsc --noEmit`.
- [x] Production build Next.js berhasil.
- [x] Browser QA: bersihkan batu → tanam → timer selesai → panen → mulai mesin → timer selesai → ambil pakan → kirim pesanan; stok, XP, koin, hearts, dan status pesanan sesuai.
- [x] Browser QA: reload sesudah menyelesaikan pesanan, dan reload ketika tanaman masih tumbuh; progres pulih dan tanaman siap setelah `readyAt`.
- [x] Reset meminta konfirmasi dan memulihkan save awal.
- [x] Pemilih semua petak A–D dapat diakses dari UI.
- [x] Setelah penambahan progression: ESLint, typecheck, dan production build berhasil.
- [x] DOM responsive diperiksa pada 390×844 dan 1366×900; tidak ditemukan overflow horizontal.
- [x] Tab keyboard dapat menjangkau tautan utama, reset, peta misi, dan pemilih petak A–D.
- [x] Touch target petak dan aksi dinaikkan pada viewport sempit; progress XP/misi memakai semantic progressbar.
- [ ] Aktivasi aksi keyboard, klaim misi, kenaikan level, dan perluasan peta belum dapat diuji karena browser melaporkan `ChunkLoadError` pada bundle JavaScript.
- [ ] Gerak 3D belum dapat ditinjau secara visual pada browser: Canvas tertahan di loading karena bundle tidak terhidrasi; production build tetap berhasil.

### Catatan pemulihan preview

Halaman HTML terbaru berhasil dirender tetapi skrip client gagal dimuat (`/_next/static/chunks/1in1k8_pi06oe.js`). Reload tidak memperbaikinya. Port 3000/3001 sedang digunakan proses lain, sedangkan browser tidak dapat menjangkau preview di port alternatif. Restart server pengembangan Green Farm pada port 3000 diperlukan sebelum pemeriksaan interaksi/animasi dapat dituntaskan. Jangan hentikan proses port yang tidak teridentifikasi karena mungkin digunakan sesi kerja lain.

## Fase 6 — Optimasi dan rilis · ditunda di luar lingkup gameplay lokal

- [ ] Ukur dan optimalkan bundle/render pada device target setelah fitur berikutnya disetujui.
- [ ] Rancang migrasi save server-authoritative dan tinjau RLS setelah Supabase project tersedia.
- [ ] Tambahkan Auth, remote save, serta konfigurasi environment setelah URL dan publishable key tersedia.
- [ ] Preview/deploy melalui Vercel setelah project/account ditentukan dan semua konfigurasi lulus QA.

## Catatan penyelesaian

Scope saat ini mencakup progression lokal level 1–100, 100 misi utama, animasi dunia prosedural, dan perbaikan ukuran target UI. Database/auth/deploy publik tetap ditunda sesuai arahan; seluruh save tetap di browser. Build valid, tetapi QA runtime terbaru menunggu restart preview karena chunk client gagal dimuat pada server yang sudah berjalan.
