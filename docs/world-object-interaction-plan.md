# Rencana dan hasil: interaksi objek dunia Green Farm

## Analisis referensi

Lampiran adalah bahan rancangan, bukan instruksi terpisah yang harus dijalankan. Screenshot yang menyertainya juga menyatakan dirinya sebagai wireframe konseptual, jadi dipakai sebagai arah UX, bukan sebagai bukti tampilan yang sudah ada.

Rancangan menggabungkan tiga kelompok pekerjaan:

1. **Objek dunia**: bangunan ternak dan mesin perlu hadir sebagai objek 3D yang bisa dipilih, punya tapak lahan, status, serta tindakan yang sesuai.
2. **Interaksi dan tata letak**: informasi mengikuti objek terpilih; pemain bisa memindahkan objek dengan validasi tabrakan; tombol utama tetap mudah ditemukan di mobile.
3. **Pemisahan render dan aturan permainan**: Three.js memperlihatkan status; timestamp dan aturan save lokal tetap menentukan kapan hasil benar-benar dapat diambil.

Konteks produk yang sudah disepakati tetap berlaku: jangan menambahkan database, simpan progres di perangkat, pertahankan progres level/misi 1–100, dan gunakan aset 3D buatan game sendiri. Referensi eksternal yang tertulis di lampiran tidak menjadi kewajiban untuk mengunduh atau memakai aset.

## Urutan rencana

| Tahap | Pekerjaan | Selesai bila |
| --- | --- | --- |
| 1. Audit alur saat ini | Petakan save, mesin, kandang, objek 3D, dan UI layar kecil | perubahan tidak merusak map, timer, inventory, atau save lama |
| 2. Aturan tapak | Tetapkan mesin kecil 1×1 dan dapur besar 2×2; validasi terhadap petak, mesin lain, dan kandang | pembelian/relokasi tidak membuat objek bertumpuk |
| 3. Seleksi objek | Klik mesin atau kandang membuka panel yang sesuai; klik petak tetap membuka aksi tanaman | panel memberi status, resep, timer, kebutuhan, dan tindakan langsung |
| 4. Relokasi | Pratinjau lokasi, arah grid, putar, konfirmasi/batal, petunjuk alasan invalid | lokasi tidak valid tidak dapat dikonfirmasi dan posisi valid tersimpan |
| 5. UX layar sentuh | Tambah navigasi bawah Tanam/Bangun/Produksi/Tas/Misi dan susun dunia lebih dahulu di layar kecil | menu utama bisa dicapai dengan ibu jari dan panel tidak menutupi dunia |
| 6. Pemeriksaan implementasi | Periksa TypeScript dan ESLint; cek app yang sedang terbuka | error statis diselesaikan dan status visual disebutkan apa adanya |

## Implementasi pada siklus ini

- Mesin punya ukuran tapak yang dipakai validator; mesin roti/dapur manor memakai 2×2, lainnya 1×1. Relokasi petak juga menghindari tapak mesin dan bangunan ternak.
- Relokasi mesin memvalidasi petak tanaman, mesin lain, dan ruang kandang. Mesin yang dibeli mencari titik kosong berdasarkan tapak, bukan hanya satu koordinat.
- Model mesin dan kandang ayam sekarang dapat dipilih di dunia. Kandang membuka ringkasan jumlah hewan, pakan, hasil siap, aksi cepat untuk hewan pertama, dan pengelolaan ternak lengkap.
- Panel mesin menampilkan resep, kebutuhan bahan yang kurang, status kerja, progress timer, ambil hasil, upgrade, dan relokasi.
- Relokasi menampilkan bidang pratinjau hijau/merah di dunia. Pemain dapat menggeser di grid, memutar, membatalkan, atau mengonfirmasi. Penolakan menyebut penyebabnya.
- Navigasi bawah lima tab ditambahkan untuk mobile. Dunia ditempatkan sebelum panel, dan dok mesin disembunyikan pada layar kecil agar aksi objek terpilih menjadi fokus.
- Aturan waktu tetap berbasis timestamp di state game; animasi hanya membaca status tersebut. Tidak ada database baru.

## Batas ruang lingkup yang masih perlu pekerjaan lanjutan

- Kandang ayam, sapi, ternak kecil, rumah lebah, dan kandang kuda kini menjadi entitas 3D dengan ukuran, rotasi, level, kapasitas, dan kompatibilitas spesies. Posisi tersimpan pada save lokal versi 4; save versi sebelumnya dimigrasikan dengan kandang ayam awal. Tata letak kandang mengikuti pemain saat berpindah map.
- Pratinjau relokasi mesin/kandang digerakkan melalui kontrol grid, bukan mengikuti pointer/touch bebas. Objek baru ditempatkan otomatis di petak kosong lalu bisa segera dipindah dengan pratinjau hijau/merah.
- Mesin sudah punya perbedaan idle/working/ready dan beberapa visual proses. Panel memberi alasan bahan belum cukup. Rangkaian bakery lima tahap penuh, antrean beberapa batch, dan indikator "needs attention" yang konsisten per resep masih menjadi perluasan berikutnya.
- Screenshot referensi menggambarkan tata letak/angka konseptual; implementasi mempertahankan ekonomi dan komponen game yang sudah ada daripada menyalin angka wireframe.

## Hasil pemeriksaan

TypeScript (`npx tsc --noEmit`) dan ESLint (`npm run lint -- --no-cache`) lulus. Halaman lokal terbuka dan dirender; browser accessibility snapshot memperlihatkan shell game, UI panel, tutorial, serta dock mesin. Snapshot itu tidak memverifikasi geometri/pointer 3D maupun layout mobile secara visual, jadi status QA visual penuh belum bisa dinyatakan lulus. Tidak ada pengujian otomatis yang ditambahkan.
