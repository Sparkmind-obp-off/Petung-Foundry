// PetungHome — Landing outcome (hero + tool gratis + SKU + cara kerja + etika)
// SSOT: B9-02 (positioning, headline pattern), B9-04 (framing), B9-05 (blueprint)
import { Header, Footer } from './layout'
import { TrustStrip } from '../components/Disclaimer'
import { SOLUTIONS } from '../data/solutions'

export const PetungHome = () => {
  const featured = SOLUTIONS.filter((s) =>
    ['petung-pengantin', 'petung-usaha', 'kartu-weton'].includes(s.slug)
  )
  return (
    <>
      <Header />

      {/* HERO */}
      <section id="hero-section" class="hero">
        <div class="hero-inner">
          <span class="hero-eyebrow">Outcome Foundry × Budaya Jawa</span>
          <h1 class="hero-title">
            Mulai hajat & usahamu di <span class="accent">hari baik</span> —
            rapi, modern, bermakna.
          </h1>
          <p class="hero-sub">
            Pétung mengubah <strong>weton & primbon</strong> menjadi artefak budaya yang
            rapi & dipersonalisasi: kalender hari baik, kartu weton, dan nama usaha selaras
            tradisi. <em>Bukan ramalan — ini kearifan Jawa yang dirapikan untukmu.</em>
          </p>
          <div class="hero-cta">
            <a href="/petung/cek" class="btn btn-primary btn-lg">
              <i class="fas fa-wand-magic-sparkles"></i> Cek Wetonmu — Gratis
            </a>
            <a href="#solusi" class="btn btn-ghost btn-lg">
              Lihat Solusi
            </a>
          </div>
          <TrustStrip />
        </div>
        <div class="hero-card" aria-hidden="false">
          <WetonMiniWidget />
        </div>
      </section>

      {/* SOLUSI */}
      <section id="solusi" class="section">
        <div class="section-head">
          <h2>Solusi Pétung</h2>
          <p>Satu mesin perhitungan, banyak hasil siap pakai. Pilih sesuai momenmu.</p>
        </div>
        <div class="solusi-grid">
          {featured.map((s) => (
            <article class="solusi-card">
              {s.badge && <span class="card-badge">{s.badge}</span>}
              <h3>{s.nama}</h3>
              <p class="card-promise">{s.promise}</p>
              <ul class="card-outcomes">
                {s.outcomes.slice(0, 3).map((o) => (
                  <li>
                    <i class="fas fa-check"></i> {o}
                  </li>
                ))}
              </ul>
              <div class="card-price">
                <span class="price-pending">
                  <i class="fas fa-tag"></i> Harga menunggu konfirmasi
                </span>
                <small>Usulan: {s.priceDraft}</small>
              </div>
              <a href={`/petung/${s.slug}`} class="btn btn-outline btn-block">
                Lihat detail
              </a>
            </article>
          ))}
        </div>
        <div class="text-center" style="margin-top:1.5rem">
          <a href="/petung" class="btn btn-ghost">Lihat semua solusi & katalog →</a>
        </div>
      </section>

      {/* CARA KERJA */}
      <section id="cara-kerja" class="section section-alt">
        <div class="section-head">
          <h2>Cara Kerja</h2>
          <p>Pipeline Outcome Foundry — dari input ke hasil yang dapat dibuktikan.</p>
        </div>
        <div class="steps-grid">
          {[
            { n: '1', t: 'Masukkan tanggal lahir', d: 'Tool gratis hitung weton & neptu kamu secara deterministik.' },
            { n: '2', t: 'Pilih outcome', d: 'Hari baik pernikahan, nama usaha, kartu weton, atau hajat lain.' },
            { n: '3', t: 'Mesin merakit artefak', d: 'Perhitungan + render rapi, dengan sumber metode tampil.' },
            { n: '4', t: 'Terima hasil live', d: 'Kalender/kartu/halaman jadi & dapat diakses + disclaimer budaya.' },
          ].map((step) => (
            <div class="step-card">
              <span class="step-num">{step.n}</span>
              <h4>{step.t}</h4>
              <p>{step.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ETIKA / TRUTH-LOCK */}
      <section id="etika" class="section">
        <div class="section-head">
          <h2>Etika & Truth-Lock</h2>
          <p>Kami menjual artefak budaya, bukan nasib.</p>
        </div>
        <div class="etika-grid">
          <div class="etika-col etika-ok">
            <h4><i class="fas fa-circle-check"></i> Yang kami lakukan</h4>
            <ul>
              <li>Menyajikan perhitungan weton & primbon sebagai edukasi-budaya.</li>
              <li>Menampilkan sumber & metode perhitungan (transparan & dapat diaudit).</li>
              <li>Mengakui ada variasi antar daerah/aliran primbon.</li>
              <li>Menghormati semua keyakinan & memberi kebebasan memilih.</li>
            </ul>
          </div>
          <div class="etika-col etika-no">
            <h4><i class="fas fa-circle-xmark"></i> Yang TIDAK kami lakukan</h4>
            <ul>
              <li>Menjanjikan "dijamin hoki / langgeng / sukses".</li>
              <li>Menakut-nakuti ("kalau salah hari, sial").</li>
              <li>Mengklaim mencegah sial / menolak bala.</li>
              <li>Klaim medis, finansial, atau hukum apa pun.</li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

// Widget mini cek weton di hero (progresif — diaktifkan oleh app.js)
const WetonMiniWidget = () => (
  <div class="weton-widget" id="hero-weton-widget">
    <h3><i class="fas fa-calendar-day"></i> Cek Weton Cepat</h3>
    <label for="hero-tgl">Tanggal lahir</label>
    <input type="date" id="hero-tgl" class="input" max="2030-12-31" />
    <button id="hero-cek-btn" class="btn btn-primary btn-block">
      Hitung Weton
    </button>
    <div id="hero-weton-result" class="weton-result" hidden></div>
  </div>
)
