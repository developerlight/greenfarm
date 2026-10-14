# Green Farm — Asset Manifest

Semua aset visual pada vertical slice ini dibuat khusus untuk Green Farm dengan SVG sendiri, CSS, atau geometri Three.js/R3F yang ditulis di source code. Tidak ada model, tekstur, atau file permainan yang diambil dari Green Farm 3 atau paket pihak ketiga.

| ID | Sumber | Tipe | Status | Evidence / desain | Keterangan |
| --- | --- | --- | --- | --- | --- |
| `farm.meadow` | `src/game/world/farm-canvas.tsx` · `Meadow` | Geometri 3D prosedural | Aktif | D: panggung kebun MVP | Pulau rumput low-poly |
| `farm.plot` | `src/game/world/farm-canvas.tsx` · `Plot` | Geometri 3D prosedural | Aktif | E: Part 1; D: empat petak | Tanah isometrik, status terpilih |
| `farm.rock-pile` | `src/game/world/farm-canvas.tsx` · `RockPile` | Geometri 3D prosedural | Aktif | E: tutorial “Making Room”, Part 1 6:17 | Tiga batu; bisa dipilih dan dibersihkan |
| `crop.wheat` | `src/game/world/farm-canvas.tsx` · `CropRows`, `WheatPlant` | Geometri 3D prosedural | Aktif | E: tahap tanaman Part 1–2; D: durasi/hasil MVP | Tinggi/warna mengikuti progress; batang dan daun bergoyang, bulir terpisah muncul saat matang |
| `building.barn` | `src/game/world/farm-canvas.tsx` · `Barn` | Geometri 3D prosedural | Aktif | E: bangunan pertanian berulang; D: bentuk lumbung orisinal | Siluet dan palet dibuat sendiri |
| `building.feed-mill` | `src/game/world/farm-canvas.tsx` · `FeedMillBuilding` | Geometri 3D prosedural | Aktif | E: Feed Mill Part 3–4; D: siluet bangunan | Hopper, roda, atap, pintu |
| `animal.chicken` | `src/game/world/farm-canvas.tsx` · `Chicken` | Geometri 3D prosedural | Dekoratif | E: ayam tampak pada beberapa scene awal | Jalan pendek, bob, peck, dan wing flap; belum menjadi sistem hewan yang dapat dirawat |
| `prop.tree` | `src/game/world/farm-canvas.tsx` · `Tree` | Geometri 3D prosedural | Aktif | E: orchard/pohon Part 2, 8, 10–12; D: spesies pohon generik | Kanopi bergerak ringan sementara batang tetap |
| `prop.butterfly` | `src/game/world/farm-canvas.tsx` · `Butterfly` | Geometri 3D prosedural | Aktif | D: detail suasana orisinal | Dua jalur terbang berulang dengan kepakan sayap |
| `prop.flowers` | `src/game/world/farm-canvas.tsx` · `Flowers` | Geometri 3D prosedural | Aktif | D: dekorasi | Ornamen kecil scene |
| `ui.game-panels` | `src/components/game-prototype.tsx`, `src/app/globals.css` | React + CSS | Aktif | E: HUD, pesanan, timer; D: tata letak Green Farm Web | Panel inventaris, pesanan, aksi, mesin |
| `proto.*` | `public/assets/prototype/*.svg` | SVG orisinal | Style test | D: eksplorasi visual awal | Belum digunakan sebagai aset runtime 3D |

## Art direction dan produksi

- Stylized low-poly isometrik, cahaya dari kiri atas, palet rumput hijau dan kayu/tanah hangat.
- Model 3D runtime sekarang berasal dari primitive geometry untuk menjaga beban ringan dan mudah diedit.
- Blender tidak tersedia di lingkungan saat ini; karena itu aset vertical slice dibuat native di R3F. File `.blend`/`.glb` bukan prasyarat untuk menguji loop gameplay ini.
- Setiap model lanjutan harus memiliki ID, file sumber, status, tujuan penggunaan, basis evidence atau label desain, serta catatan ukuran/performa.
