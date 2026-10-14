# Rencana & Implementasi Map dan Musim

**Status:** implementasi lokal awal selesai, perlu QA interaksi dan iterasi balancing  
**Sumber:** spesifikasi map dan musim dari lampiran pengguna. Level, harga, dan durasi adalah angka desain Green Farm Web, bukan klaim mengenai Green Farm 3.

## Analisis dan keputusan

Spesifikasi meminta map bertema yang dibuka lewat tiga gerbang—level, pengembangan map sebelumnya, dan misi wilayah—serta profil musim berbeda per map. Sistem map harus berdiri di atas save lokal yang sudah mempunyai petak grid dan beberapa mesin. Jika lahan atau musim disimpan hanya sebagai state global, berpindah wilayah akan menimpa kebun sebelumnya.

Keputusan implementasi:

- Ada enam map awal: Green Meadows, Tropical Valley, Autumn Woods, Frostpeak Highlands, Desert Oasis, dan Coastal Islands. Level yang dipakai mengikuti usulan lampiran (1, 8, 15, 24, 34, 45); nilai ini konfigurasi awal dan bisa dibalance.
- Map 2–6 memerlukan level, minimal 80% pengembangan map sebelumnya, serta milestone misi cerita 10/20/30/40/50. Pengembangan dihitung dari jumlah tile (70%) dan fasilitas mesin (30%), maksimum sepuluh tile dan tiga fasilitas per map. Dekorasi tidak dihitung.
- Satu profil pemain menyimpan koin, XP, inventaris, dan tutorial bersama. Tile, mesin, dan jam musim disimpan per map. Tanaman dan mesin tetap berkembang selama pemain berada di wilayah lain karena timer/tanggal dihitung dari timestamp.
- Musim berjalan offline dari timestamp lokal. Satu hari dalam kalender game = 3 menit nyata dan satu musim berlangsung tujuh hari game (21 menit). Nilai ini sengaja dapat diubah setelah balancing.
- Green Meadows/Autumn Woods memakai empat musim; Tropical Valley, Desert Oasis, dan Coastal Islands memakai musim hujan/kemarau; Frostpeak memakai dua zona (lereng bersalju dan lereng musim semi).
- Tanaman yang sudah tumbuh tetap bisa dipanen setelah musim berganti. Musim membatasi penanaman baru dan mengubah palet lingkungan. Setiap wilayah membuka katalog tanaman khusus.

## Urutan pengerjaan

1. Definisikan data map, tema, musim, zona, tanaman, level, dan gerbang sebagai katalog statis.
2. Perluas save lokal dan migrasikan save lama; buat state petak/mesin/timestamp terpisah untuk setiap map.
3. Implementasikan hitung musim dan pengembangan map dari timestamp serta progres kebun.
4. Implementasikan gerbang level + progres map terdahulu + milestone misi, kemudian perjalanan antarmap.
5. Tampilkan peta dunia dengan alasan lock, progres map, musim aktif, serta kontrol ekspedisi.
6. Terapkan aturan tanaman musiman dan visual lingkungan/tema sesuai map.
7. Verifikasi migrasi, perpindahan map, timer saat offline, dan syarat unlock di browser.

## Yang sekarang sudah terimplementasi

- Konfigurasi enam map dan profil musim pada [worlds.ts](../src/game/state/worlds.ts).
- Save versi 3 dapat migrasi data versi sebelumnya; state tile, mesin, dan musim disimpan terpisah saat berpindah wilayah. Inventaris dan misi cerita tetap global.
- Perjalanan map terkunci sampai level, 80% pengembangan map terdahulu, dan milestone cerita terpenuhi. Panel Peta Dunia menunjukkan syarat dan persentase pengembangan.
- Perkembangan map menghitung kepemilikan tile dan jumlah mesin, tidak menghitung dekorasi.
- Musim lokal tujuh hari game per musim; Frostpeak memberi musim berbeda menurut sisi peta. Musim membatasi benih yang dapat ditanam dan tanaman yang sudah tumbuh tidak mati saat pergantian musim.
- Katalog tanaman dan warna lingkungan berubah menurut map/musim. Coastal memiliki tepi laut, Desert memiliki oasis, dan Frostpeak memiliki puncak bersalju sederhana yang dirender dari geometri buatan sendiri.

## QA lanjutan

- Periksa UI dan interaksi Peta Dunia pada ponsel dan desktop.
- Pastikan save v2/v3 lama dimigrasikan tanpa kehilangan stok, tanaman tumbuh, timer mesin, misi, maupun tutorial.
- Verifikasi musim tidak berubah saat map lain dikunjungi, lalu tetap bergerak selama map tidak aktif.
- Uji gerbang map, zona musim, katalog tanaman, dan peta berukuran penuh di browser setelah chunk Canvas runtime termuat.
- Tinjau lagi target 80%, 3 menit/hari, dan harga/level berdasarkan sesi gameplay nyata.
