# Green Farm Web — MVP Game Design Document

**Versi:** 0.3 · **Status:** progression lokal level 1–100 dan misi utama aktif · **Mode:** single-player web

Dokumen ini menetapkan MVP yang dapat dimainkan, bukan klaim bahwa seluruh sistem Green Farm 3 telah direkonstruksi. Bukti video dan keputusan adaptasi dicatat terpisah.

## Tujuan pemain

Buka satu petak berbatu, tanam dan panen gandum, olah hasil panen menjadi pakan di mesin produksi, lalu kirim pakan kepada tetangga. Progres disimpan di browser dan timer dihitung dari timestamp sehingga pertumbuhan tetap berjalan saat tab ditutup.

## Rujukan dan status kepastian

| Label | Makna | Dasar |
| --- | --- | --- |
| **E — Bukti** | Terlihat pada video referensi | Tutorial Part 1 meminta pemain membereskan batu; tanaman terlihat pada beragam tahap; feed mill menampilkan produk/timer; tetangga punya permintaan, tombol kirim/tolak, hearts, XP, dan koin. |
| **D — Desain Green Farm Web** | Keputusan orisinal agar MVP bisa dimainkan | Satu benih menjadi tiga gandum; durasi uji 25 detik; resep dua gandum menjadi satu pakan selama 12 detik; permintaan Rosco adalah satu pakan; angka hadiah MVP; save localStorage. |

Rincian hasil pengamatan dan batas sampel ada di [gameplay-evidence-log.md](gameplay-evidence-log.md). Video yang tersedia adalah cuplikan sampel, tidak seluruh rekaman. Playlist juga tidak memiliki Part 14 yang unik: tautan indeks 14 dan 15 sama-sama membuka Part 15.

## Loop utama vertical slice

```text
Pilih petak berbatu → bersihkan → tanam gandum → tunggu → panen
       → 3 gandum + benih baru → masukkan 2 gandum ke mesin pakan
       → tunggu 12 detik → ambil pakan → kirim 1 pakan ke Rosco
       → koin + XP + hati → progres tersimpan
```

## Aturan MVP

| Sistem | Aturan implementasi | Label |
| --- | --- | --- |
| Lahan awal | Empat petak: A tertutup batu, B–D tanah kosong. Membersihkan batu tidak berbiaya pada vertical slice. | E: batu menghalangi lahan; D: jumlah dan tanpa biaya |
| Benih | Mulai dengan 3 benih. Menanam 1 benih di tanah kosong memulai timer gandum selama 25 detik. | D |
| Panen | Setelah timer selesai, panen memberi 3 gandum, 1 benih, 5 XP, dan 4 koin; petak kembali kosong. | D |
| Mesin pakan | Satu pekerjaan pada satu waktu. Mulai memakan 2 gandum, timer 12 detik, lalu dapat diambil sebagai 1 pakan dan 3 XP. | E: Feed Mill bertimer dan memproses pakan; D: resep, antrean tunggal, waktu uji |
| Pesanan tetangga | Rosco meminta 1 pakan. Pengiriman memakan 1 pakan dan memberi 30 koin, 12 XP, dan 1 hati. Permintaan berikutnya aktif saat misi pengiriman berikutnya tiba. | E: permintaan, rewards, hearts, kirim/tolak; D: kebutuhan dan reward MVP |
| Level | Level 1–100 dihitung dari total XP. Kebutuhan level berikutnya bertambah bertahap (`60 + 2 × level` XP); level berhenti di 100. XP datang dari panen, produksi pakan, dan hadiah misi. | D |
| Bab dan misi | 100 misi linear dalam 10 bab, satu misi aktif pada satu waktu. Misi meliputi bersih-bersih lahan, tanam, panen, produksi pakan, dan pengiriman pesanan; misi memberi XP dan koin. Petak batu hanya menjadi misi sekali karena lahan awal memiliki satu batu. | D |
| Pesanan berulang | Pesanan Rosco kembali tersedia ketika misi pengiriman berikutnya aktif; setiap pengiriman tetap memerlukan satu pakan dan memberi reward transaksi. | D |
| Penyimpanan | Save versi 2 disimpan di localStorage. Save versi 1 dimigrasikan lokal dengan mempertahankan progres kebun dan menambahkan progres misi. `readyAt` timestamp menjadi sumber kebenaran lokal untuk timer tanaman/mesin. | D |
| Reset | Tombol reset menampilkan konfirmasi sebelum menghapus save lokal dan memulai dari save baru. | D |

Nilai di atas sengaja singkat untuk sesi demo dan tidak menyalin saldo/durasi dari save pembuat video. Tidak ada pembelian premium atau uang sungguhan.

## Alur layar

1. **Kebun:** kamera isometrik, petak A–D yang dapat dipilih, status visual batu/tanah/tanaman, inventaris, dan pesan aksi.
2. **Aksi petak:** pilihan bersihkan, tanam, atau panen sesuai status; tombol nonaktif bila syarat belum terpenuhi.
3. **Mesin pakan:** kartu produksi menampilkan resep, waktu tersisa, dan tombol ambil setelah selesai.
4. **Misi utama:** target, progres, hadiah XP/koin, tombol klaim, dan peta 10 bab/100 misi. Status bab dan misi aktif ditampilkan tanpa meninggalkan kebun.
5. **Permintaan Rosco:** barang yang diminta, reward, hearts, dan tombol kirim yang nonaktif sampai barang tersedia.
6. **Save:** state dipulihkan saat membuka ulang `/game`. Reset eksplisit meminta konfirmasi.

## Arah aset orisinal

Semua aset visual MVP dibuat untuk proyek ini dengan SVG/CSS atau geometri Three.js/R3F buatan sendiri. Tidak menggunakan model dari game sumber, APK, atau paket aset pihak ketiga. Kamera ortografis/isometrik, palet hijau daun, tanah hangat, bangunan lumbung merah-oranye, dan bentuk low-poly ringan.

Aset aktif yang dirender: pulau kebun/rumput, petak, batu, gandum bertumbuh dan siap panen, pepohonan, lumbung, ayam, bunga, serta ikon/tampilan mesin dan UI. Scene masih menggunakan geometri prototipe; belum ada file Blender/GLB karena Blender tidak tersedia pada lingkungan kerja saat ini.

## Batas lingkup

- Termasuk: tutorial singkat melalui tujuan UI, crop loop satu jenis, produksi satu resep, pesanan NPC berulang, 100 misi dalam 10 bab, progression sampai level 100, timer offline, save lokal, empat petak, aset runtime orisinal.
- Belum termasuk: login/server save, Supabase schema/migration, lintas perangkat, pembelian/premium, marketplace, tanaman/hewan tambahan, event musiman, avatar pemain, audio, atau deploy publik. Misi utama 1–100 sudah memiliki target, hadiah, dan peta bab lokal; animasi lingkungan/ayam/kupu-kupu sudah ada sebagai gerak dekoratif prosedural. Balancing jangka panjang masih perlu iterasi.
- Alasannya: belum ada proyek/kredensial Supabase/Vercel, dan data referensi belum cukup untuk menetapkan sistem tersebut tanpa mengarang aturan.

## Kriteria penerimaan MVP

- [x] Pemain dapat memilih tiap petak dan membersihkan A.
- [x] Gandum dapat ditanam hanya pada tanah kosong dan mengurangi benih satu.
- [x] Sebelum 25 detik tombol panen tidak tersedia; setelah timer selesai panen memberi hasil yang ditetapkan dan mengosongkan petak.
- [x] Mesin menolak resep jika gandum kurang, membatasi satu pekerjaan, dan memberi pakan hanya setelah 12 detik.
- [x] Pesanan tidak dapat dikirim sebelum pakan ada, berhasil sekali, mengurangi stok, dan memberi reward tepat sekali.
- [x] Refresh/menutup lalu membuka kembali halaman mempertahankan progres serta menghitung timer dengan benar.
- [x] Reset save meminta konfirmasi.
- [x] Layout DOM diperiksa pada viewport 390×844 dan 1366×900 tanpa overflow horizontal; keyboard Tab mencapai peta misi dan pemilih petak.
- [ ] Aktivasi keyboard dan alur misi interaktif belum bisa diverifikasi karena bundle client di browser gagal dimuat.
- [x] Lint, typecheck, production build, dan alur browser desktop berhasil.

- [ ] QA animasi 3D dan aktivasi gameplay di browser perlu diulang setelah server preview direstart dan bundle client termuat.

## Gerbang setelah vertical slice

Sesudah kriteria di atas lolos, langkah berikutnya adalah peninjauan GDD dan daftar aset dengan pemilik proyek, bukan ekspansi otomatis ke katalog besar. Jika disetujui, buat rancangan migrasi server-authoritative untuk save dan transaksi, lalu implementasi Auth/Supabase setelah kredensial tersedia. Deployment Vercel mengikuti setelah proyek dan akun siap.



