import Link from "next/link";

const features = [
  { icon: "✦", title: "100 level perjalanan", copy: "Buka bab baru, temui tetangga, dan tumbuhkan kebunmu." },
  { icon: "⌂", title: "Dunia kebun 3D", copy: "Jelajahi lahan isometrik dengan tanaman dan hewan hidup." },
  { icon: "♡", title: "Cerita yang tumbuh", copy: "Selesaikan misi kecil dan bangun hubungan di desa." },
];

function ScenicGarden() {
  return (
    <div className="home-garden" aria-label="Ilustrasi kebun Green Farm saat matahari terbit">
      <div className="garden-sky"><span className="garden-sun" /><i className="cloud cloud-one" /><i className="cloud cloud-two" /></div>
      <div className="far-hill hill-one" /><div className="far-hill hill-two" />
      <div className="garden-tree tree-left"><i /><b /></div><div className="garden-tree tree-right"><i /><b /></div>
      <div className="garden-barn"><div className="barn-roof" /><div className="barn-body"><i /><b /><span /></div></div>
      <div className="garden-path" />
      <div className="crop-row row-back"><i /><i /><i /><i /><i /></div>
      <div className="crop-row row-front"><i /><i /><i /><i /><i /><i /></div>
      <div className="garden-chicken"><i /><b /><span /></div>
      <div className="garden-sign"><span>GREEN FARM</span><b>Hari baru, kebun baru</b></div>
      <span className="garden-flower flower-a">✿</span><span className="garden-flower flower-b">✿</span>
    </div>
  );
}

export default function Home() {
  return (
    <main className="home-shell home-world">
      <header className="topbar home-topbar">
        <Link className="brand" href="/" aria-label="Green Farm beranda"><span className="brand-mark">✿</span> Green Farm</Link>
        <nav className="home-nav" aria-label="Navigasi utama"><a href="#perjalanan">Perjalanan</a><a href="#tentang">Tentang kebun</a></nav>
        <Link className="home-play-link" href="/game">Masuk ke kebun <span aria-hidden="true">↗</span></Link>
      </header>

      <section className="hero home-hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-leaf">✿</span> SEBUAH PETUALANGAN DI DESA</p>
          <h1>Tanam harapan,<br /><span>tumbuhkan cerita.</span></h1>
          <p className="hero-description">Bangun kebun impianmu, rawat hasil panen, dan bantu para tetangga. Setiap pagi membawa sesuatu yang baru.</p>
          <div className="home-actions"><Link className="primary-button" href="/game">Mulai bermain <span aria-hidden="true">→</span></Link><span className="save-note"><i /> Progres tersimpan di perangkatmu</span></div>
          <div className="welcome-stats"><div><strong>100</strong><span>level untuk dijelajahi</span></div><i /><div><strong>10</strong><span>bab penuh cerita</span></div></div>
        </div>
        <ScenicGarden />
      </section>

      <section className="journey-section" id="perjalanan">
        <div className="section-heading"><div><p className="eyebrow">LANGKAH KECIL, KEBUN BESAR</p><h2>Semua tumbuh dari satu benih.</h2></div><p>Mulai dari lahan sederhana. Pelan-pelan, jadikan desa ini rumah.</p></div>
        <div className="journey-cards">{features.map((feature, index) => <article className="journey-card" key={feature.title}><span className={`journey-icon journey-icon-${index}`}>{feature.icon}</span><div><h3>{feature.title}</h3><p>{feature.copy}</p></div><span className="journey-step">0{index + 1}</span></article>)}</div>
      </section>
      <footer className="home-footer" id="tentang"><span>Green Farm <i>·</i> Sebuah dunia kecil untuk dirawat</span><Link href="/game">Lanjutkan petualangan <span aria-hidden="true">→</span></Link></footer>
    </main>
  );
}
