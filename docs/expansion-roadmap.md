# Green Farm — Rencana Ekspansi Gameplay

**Status:** sedang dikerjakan; fondasi sistem ekspansi sudah masuk ke implementasi lokal  
**Batas saat ini:** single-player, save lokal, tanpa database  
**Arah:** memperluas game kebun menjadi simulasi yang bisa ditata dan dimainkan dalam jangka panjang.

## 1. Kondisi sekarang

Game saat ini sudah memiliki loop tanam–panen, produksi pakan pada satu mesin, pesanan Rosco, koin/XP, 100 misi linear, save browser, dan scene 3D isometrik. Namun modelnya masih vertical slice: empat petak dengan ID tetap, gandum sebagai satu-satunya tanaman, satu resep/mesin, satu misi aktif, dan kamera statis. Belum ada katalog belanja, tata letak lahan yang bisa diedit, onboarding dialog, atau area peta yang dapat diperluas.

Karena lahan, mesin, tanaman, dan misi akan berubah selama bermain, fondasi berikutnya adalah mengubah bentuk save dan aturan permainan sebelum menambah banyak konten. Database tetap di luar lingkup.

## 2. Keputusan desain yang disarankan

### Dunia dan lahan

- Gunakan peta tile/grid dengan koordinat stabil (`x`, `z`) dan ID unik untuk petak, bangunan, dekorasi, serta objek yang ditempatkan.
- Perluasan membeli kelompok tile/area yang bersebelahan. Setiap area menampilkan harga, syarat level, dan isi awal (misalnya batu, pohon, atau lahan kosong).
- Sediakan **Mode Tata Kebun** untuk memindahkan tile yang dapat dipindahkan dan bangunan. Pemindahan tidak mengubah isi tanaman atau progres timer. Validasi batas lahan, tabrakan, akses jalan, dan footprint mesin sebelum menyimpan posisi.
- Bedakan tanah tanam, dekorasi, bangunan produksi, dan penghalang. Tanaman berpindah bersama tile saat tile dipindahkan; mesin dan bangunan dipindahkan sebagai entitas tersendiri.
- Sediakan batal/konfirmasi sebelum keluar dari mode tata, serta umpan balik visual untuk lokasi valid/tidak valid.

### Tanaman dan produksi

- Setiap tanaman punya definisi katalog: ID, nama, harga/benih, waktu tumbuh, hasil panen, XP, level buka, musim/lingkungan bila dipakai, dan model/warna.
- Tanaman pertama setelah gandum harus cepat tumbuh dan mudah dijual agar toko terasa berguna. Perkenalkan jenis berikutnya bertahap berdasarkan level.
- Mesin memakai data katalog dan resep, bukan logika khusus per mesin: biaya input, waktu proses, output, kapasitas antrean, level upgrade, footprint, dan level buka.
- Mulai dengan beberapa peran mesin yang jelas, misalnya Feed Mill (pakan), Bakery (roti), dan Dairy Processor (produk susu). Tambah mesin setelah loop input → timer → output → penggunaan hasilnya siap.
- Upgrade mesin meningkatkan satu atau lebih atribut yang mudah dipahami (waktu, kapasitas antrean, atau slot resep) dan memakai koin/bahan; tampilkan dampaknya sebelum pembelian.

### Toko

- Satu jendela toko dengan kategori: **Benih**, **Mesin**, **Perluasan**, dan **Peningkatan**; dekorasi dapat menyusul.
- Tiap kartu barang menampilkan harga, level/syarat buka, stok atau jumlah, hasil/manfaat, dan tombol beli yang menjelaskan alasan bila nonaktif.
- Pembelian divalidasi dalam satu aksi atomik: saldo dan syarat diperiksa, barang ditambahkan/dibuka, lalu save ditulis. Klik berulang tidak boleh menggandakan transaksi.
- Koin diperoleh dari panen, produksi/pesanan, dan misi. Harga serta hadiah diseimbangkan agar pembelian perlu perencanaan tetapi tidak dapat membuat pemain buntu permanen.
- Tidak ada uang sungguhan, pembelian premium, atau transaksi server.

### Kamera dan kontrol peta

- Gunakan kontrol pointer/touch yang sesuai dengan scene R3F/Drei yang sudah terpasang: drag untuk pan, drag sekunder atau gesture dua jari untuk orbit angle, scroll/pinch untuk zoom.
- Batasi sudut vertikal dan rentang zoom supaya pemain tidak menembus tanah atau kehilangan orientasi; sediakan tombol reset kamera.
- Di layar sentuh, satu jari pada objek tetap memilih/berinteraksi; gesture kamera dimulai pada ruang kosong atau kontrol khusus agar tidak bertabrakan dengan aksi petak.
- Tambahkan kontrol UI alternatif untuk zoom dan rotasi serta instruksi singkat. Hormati `prefers-reduced-motion` untuk animasi feedback kamera.

### Tutorial percakapan

- Onboarding awal memakai dialog singkat dari karakter tetangga (disarankan Rosco), dengan potret orisinal, teks satu atau dua kalimat, tombol lanjut/lewati, dan indikator langkah.
- Tutorial mengarahkan pemain melakukan tindakan nyata: melihat petak, membersihkan lahan, membeli/menanam benih, memanen, memakai mesin, memenuhi pesanan, lalu membuka toko/tata kebun.
- Jangan menutupi scene terlalu lama: dialog dapat diminimalkan dan dibuka kembali dari menu bantuan.
- Simpan `tutorialStep`, status selesai, dan versi tutorial di save. Perubahan tutorial di masa depan tidak boleh memaksa pemain lama mengulang onboarding.

### Misi lebih dari satu

- Pertahankan alur utama 100 level sebagai jalur cerita, lalu izinkan beberapa slot misi aktif dari kategori **Cerita**, **Sampingan**, dan **Permintaan warga**. Misi harian dapat dipertimbangkan setelah jadwal/reset lokal ditetapkan.
- Gunakan ID misi tetap dan state per misi (`locked`, `available`, `active`, `readyToClaim`, `claimed`), progres, dan reward. Maksimum misi aktif ditetapkan agar HUD tetap terbaca; rekomendasi awal: 3 misi sampingan/permintaan di samping satu misi cerita.
- Aksi game memancarkan event domain seperti `crop.planted`, `crop.harvested`, `machine.outputCollected`, `order.delivered`, `land.expanded`, dan `machine.upgraded`. Semua misi aktif yang cocok menerima progres; misi tidak lagi memeriksa hanya indeks misi cerita saat ini.
- Misi bertahap boleh membuka misi baru setelah klaim, tetapi reward hanya bisa diambil satu kali. Simpan progres per ID untuk mencegah reset atau klaim ganda.
- Buat layar/panel jurnal misi yang memisahkan misi aktif, siap diklaim, dan selesai, dengan pin hingga tiga tujuan ke HUD.

## 3. Fondasi data dan migrasi lokal

Naikkan format save dari versi 2 ke versi 3 dengan migrasi deterministik dari save lama. Jangan menghapus atau mengganti key save tanpa migrasi.

Model konseptual save v3:

```text
version
player: coins, xp, hearts, inventory, unlockedLevel
world: expandedTileIds, placedObjects[], crops[]
machines: [{ id, type, position, rotation, level, jobs[] }]
missions: { statesById, activeIds, pinnedIds }
tutorial: { version, step, completed }
settings: { camera, audio, accessibility }
```

- Migrasi empat petak lama menjadi tile dengan koordinat tetap, mempertahankan status blocked/soil/growing/ready, `plantedAt`/`readyAt`, jumlah sumber daya, XP, level, hearts, pekerjaan mesin, dan pesanan.
- Petakan mesin pakan lama ke entitas `feed-mill` level 1; migrasikan timer aktif tanpa memulai ulang.
- Petakan `missionIndex`/`missionProgress` lama ke status misi cerita per ID, mempertahankan misi yang belum/siap diklaim tanpa memberi reward ulang.
- Pertahankan key `green-farm-save-v1` untuk membaca save lama. Validasi hasil migrasi dengan schema; jika data rusak, tawarkan pemulihan aman/ekspor data sebelum reset.
- Kamera boleh disimpan per perangkat, tetapi jangan menyimpan nilai yang tidak valid; fallback ke sudut awal.

## 4. Urutan pengerjaan

### Fase A — Fondasi save dan peta grid

- Definisikan tipe entity, schema Zod, aturan validasi posisi, event gameplay, dan migrasi save v2 → v3.
- Ubah rendering scene agar membaca tile/objek dari data dan mampu menampilkan area terkunci.
- Pertahankan loop tanaman, mesin pakan, order, dan misi lama pada model baru.
- **Selesai bila:** save lama pulih identik; timer berjalan terus; tidak ada tile/objek bertumpuk; reset tetap bekerja.

### Fase B — Kamera dan tata kebun

- Implementasikan pan, orbit terbatas, zoom, reset kamera, tombol kontrol, dan gesture ponsel.
- Tambahkan mode tata untuk memilih, memindahkan, memutar, menempatkan, dan membatalkan perpindahan objek.
- **Selesai bila:** mouse dan touch dapat menggerakkan kamera; objek tidak bisa ditempatkan di luar lahan atau bertabrakan; pilihan petak tetap mudah digunakan.

### Fase C — Tutorial dan navigasi game

- Tambahkan dialog tutorial berlangkah, lewati/lanjutkan, bantuan replay, dan penyimpanan state.
- Tambahkan navigasi panel untuk toko, jurnal misi, inventaris, dan pengaturan tanpa meninggalkan kebun.
- **Selesai bila:** pemain baru memahami loop inti tanpa panduan eksternal; pemain lama tidak dipaksa mengulang.

### Fase D — Toko dan ekspansi area

- Bangun katalog awal benih, satu tanaman tambahan, tile lahan, dan dekorasi/mesin awal.
- Tambahkan pratinjau biaya/hasil, validasi pembelian, unlock level, dan placement setelah membeli.
- **Selesai bila:** pembelian bisa dipulihkan dari save, saldo konsisten, area baru terbuka, dan lahan/objek bisa dipindahkan.

### Fase E — Katalog tanaman dan mesin

- Pindahkan aturan gandum dan feed mill ke definisi data bersama.
- Tambahkan tanaman baru satu per satu dan mesin dengan resep/antrean/upgrade.
- Pastikan tiap output berguna untuk penjualan, order, misi, atau resep lain.
- **Selesai bila:** konten baru dapat ditambahkan lewat katalog tanpa menduplikasi aturan inti; semua timer dan hasil tersimpan.

### Fase F — Misi paralel dan balancing

- Buat event progres, misi sampingan/permintaan warga, slot aktif dan pin ke HUD.
- Tautkan misi ke fitur baru: beli benih, tanam jenis tertentu, upgrade mesin, perluas lahan, tata kebun.
- Atur reward/harga/kurva level agar pemain dapat terus memperoleh koin dan selalu punya jalur progres.
- **Selesai bila:** beberapa misi naik bersamaan, reward hanya dapat diklaim sekali, dan 100 level cerita tetap berlanjut.

### Fase G — Poles visual dan QA perangkat

- Buat aset orisinal untuk setiap tanaman, mesin, lahan, toko, potret karakter, dan status placement.
- Perbaiki animasi transisi UI, feedback pembelian/panen, suara opsional, serta pengurangan gerak.
- Uji desktop dan sentuh, save baru dan migrasi, kamera, mode tata, pembelian, timer offline, dan seluruh kategori misi.
- **Selesai bila:** interaksi bisa dipahami tanpa instruksi tersembunyi, tidak ada kehilangan progres saat reload, dan frame rate tetap layak saat area besar.

## 5. Prioritas produk

Urutan vertikal slice berikut yang direkomendasikan:

1. Save v3 + grid/tile stabil.
2. Kamera pan/zoom/orbit.
3. Mode tata dan relokasi.
4. Dialog tutorial awal.
5. Toko dengan benih + satu perluasan lahan.
6. Satu tanaman baru dan satu mesin baru dengan upgrade dasar.
7. Beberapa misi aktif yang mengajarkan fitur-fitur tersebut.
8. Tambahkan katalog, area, resep, cerita, dan balancing sampai target konten level 100.

Urutan ini mengurangi pekerjaan ulang: toko dan misi bergantung pada katalog/data yang stabil, sementara penambahan banyak aset sebelum sistem tile/kamera matang akan menghasilkan scene yang harus dibangun ulang.

## 6. Ruang lingkup yang tetap ditunda

- Database, login, sinkronisasi lintas perangkat, multiplayer, leaderboard, dan pembayaran.
- Event kalender nyata atau misi harian berbasis server. Bila nantinya dibutuhkan offline, jadwal dan timezone harus dirancang khusus.
- Sistem sosial/chat bebas. Dialog hanya percakapan naratif yang sudah ditulis.
- Konten mesin/tanaman tanpa fungsi loop gameplay yang jelas.

## 7. Keputusan yang perlu disepakati sebelum implementasi fase konten

Rencana default jika tidak ada arahan berbeda: kamera dapat dipan dan diputar dalam batas aman; tile dibeli dalam kelompok bertetangga lalu bisa dipindah pada mode tata; toko memakai koin permainan; maksimal tiga misi sampingan aktif selain satu misi cerita; tanaman/mesin baru dibuka bertahap menurut level; tutorial dapat dilewati dan diputar ulang dari bantuan.

## 8. Implementasi yang sudah dimulai

- Save lokal versi 3 dengan migrasi versi 1/2, grid koordinat petak, entitas mesin, inventaris tanaman tambahan, status tutorial, serta tiga misi sampingan serentak.
- Pembelian benih dan lahan dengan koin, batas perluasan bertetangga, pemindahan petak tanpa menghentikan timer tanaman, katalog tiga tanaman dan tiga mesin, serta upgrade level mesin.
- Kamera dapat dipan, diputar, dan di-zoom dengan mouse/gesture sentuh; tombol kontrol kamera tersedia di scene.
- Tutorial percakapan Rosco dapat dilewati dan progresnya tersimpan.
- Panel toko, aksi tanam/panen multi-tanaman, serta kartu produksi untuk beberapa mesin sudah tersambung.

Bagian ini adalah cakupan implementasi awal yang masih perlu pemeriksaan interaksi di browser, penyempurnaan tampilan dan balancing sebelum fase ekspansi dianggap selesai.
