# Green Farm Web — Rencana simulasi lengkap

**Status:** loop gameplay lokal untuk ruang lingkup rencana ini telah terhubung; database tetap ditunda sesuai arahan. QA visual browser memerlukan direktori build yang dapat ditulis. Angka level, harga, dan durasi adalah balancing awal Green Farm Web.

## Analisis acuan

Lampiran meminta simulasi pertanian yang menyatukan tanaman, peternakan, produksi, level, cuaca, musim, ekspansi wilayah, misi, dan animasi. Referensi Green Farm 3 disebut sebagai inspirasi untuk tanaman, hewan, Feed Mill, Manor's Kitchen, penyimpanan, penjualan, dan produk. Rantai pabrik mandiri, enam wilayah, musim/cuaca yang memengaruhi gameplay, dan sistem animasi menyeluruh adalah perluasan orisinal Green Farm Web, bukan klaim fitur asli.

Keputusan produk mengikuti arahan pengguna sebelumnya: gameplay dan UX didahulukan; belum menggunakan database; semua progres disimpan lokal; cerita mempunyai 100 level/misi dengan beberapa misi sampingan aktif. Sistem konten harus ditambah lewat katalog terstruktur agar ekspansi selanjutnya tidak memerlukan perubahan format save setiap kali ada item baru.

## Rencana dan status

| Tahap | Hasil yang dituju | Status |
|---|---|---|
| 1. Fondasi progres | Level 1–100, misi utama/sampingan, tutorial percakapan, konfigurasi unlock | Misi utama 1–100, delapan misi sampingan, tutorial dan gerbang konten level aktif |
| 2. Dunia dan kalender | Enam map, lahan per map, musim/zona, perjalanan, visual lingkungan | Enam map, kebun per map, syarat level/progres/misi, perjalanan dan kalender lokal aktif |
| 3. Pertanian | Katalog lintas wilayah, tanam/tumbuh/panen, musim dan cuaca berpengaruh | 17 tanaman, 6 katalog map, level dan musim/cocok tanam; cuaca mengubah durasi secara ringan |
| 4. Peternakan | Kandang, jenis ternak, pakan, siklus hasil, koleksi produk, representasi visual | 9 spesies, 12 slot, pakan/timer/produk dan persahabatan hewan tanpa produk; hewan 3D prosedural |
| 5. Pasar dan gudang | Inventaris nyata, kapasitas, ekspansi gudang, jual produk dan hasil ternak | Pasar menjual panen, hasil ternak dan barang olahan; upgrade kapasitas dan pesanan bergilir harian per wilayah |
| 6. Produksi | Resep, bahan yang dikurangi saat mulai, waktu proses, hasil setelah selesai, status visual | 8 bangunan termasuk Dapur Manor; rantai tepung→roti, susu→mentega, buah→jus/selai/minyak, labu+susu→sup. Hasil terkunci sampai timer selesai |
| 7. Ekspansi dan unlock | Banyak lahan, mesin, petak pindah, syarat map, konten bertahap | Perluasan/pemindahan lahan, mesin berlevel dan unlock map berbasis level/progres/misi aktif |
| 8. Cuaca dinamis | Cuaca per map/hari, efek aman pada tanaman, hewan, mesin dan suasana | 6 cuaca deterministik per map/hari; pengaruh durasi tanam, partikel hujan/salju, animasi mesin dan status cuaca. Badai tidak merusak progres |
| 9. Penyelesaian pengalaman | Tutorial sistem, panel UX untuk kandang/pasar, aksesibilitas, performa, migrasi save | Panel pasar/kandang, kapasitas gudang, tutorial dan migrasi bentuk save tersedia; QA browser masih menunggu server lokal yang dapat diakses |

## Siklus permainan yang dituju

1. Pemain membuka benih/ternak/bangunan melalui level dan misi.
2. Tanaman dipilih sesuai katalog wilayah dan musim; cuaca memodifikasi durasi tanam secara ringan ketika ditanam.
3. Pemain memberi pakan kepada ternak. Timer hasil ternak berjalan meskipun tab ditutup; produk hanya masuk ketika dikoleksi.
4. Hasil panen/ternak masuk ke tas bersama yang kapasitasnya terlihat. Upgrade gudang menaikkan batas.
5. Pemain dapat menjual barang langsung di pasar, memenuhi pesanan, atau menyimpan bahan untuk resep.
6. Mesin memiliki keadaan idle/working/ready. Timer adalah sumber kebenaran; animasi menunjukkan keadaan dan tidak dapat memberikan hasil lebih awal.
7. Wilayah menyimpan lahan dan mesin sendiri; uang, pengalaman, dan inventaris pemain tetap lintas wilayah.

## Batasan implementasi lokal

Tidak ada sinkronisasi antardevice, akun, ekonomi server, atau leaderboard sampai pengguna meminta database. Waktu permainan dihitung dari jam perangkat dan save browser. Cuaca merupakan simulasi deterministik berdasarkan hari permainan agar reload tidak mengubah hasil secara acak. Item dan mesin belum diklaim setara dengan semua isi versi Android; ini adalah game web yang terinspirasi referensi.

## Catatan batas rilis

- Loop permainan lokal yang direncanakan di atas sudah terhubung. Isi 100 misi utama dan beberapa misi sampingan tersedia; spesies dan bangunan memiliki unlock level.
- Model ternak dan mesin dibuat dari geometri prosedural orisinal. Iterasi kualitas berikutnya dapat memberi tiap hewan siluet/gerak khusus dan menambah animasi panen tangan serta mixing/fermentasi yang lebih rinci.
- Sistem tersedia untuk ditambah lewat katalog: lebih banyak variasi resep, permintaan pasar musiman, tanaman pohon multi-panen, dan hewan baru.
- QA visual browser, keyboard, performa tiga dimensi, dan migrasi save lama masih perlu dijalankan di lingkungan yang dapat menulis `.next`. TypeScript dan ESLint lolos; build Webpack pernah mengompilasi route, tetapi percobaan final terkena `EPERM` pada direktori `.next` sandbox.
