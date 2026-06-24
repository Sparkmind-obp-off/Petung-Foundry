// PetungCatalog & PetungDetail — katalog SKU + halaman detail
import { Header, Footer } from './layout'
import { DisclaimerBox, TrustStrip } from '../components/Disclaimer'
import { SOLUTIONS, STREAMS, type Solution } from '../data/solutions'

export const PetungCatalog = () => (
  <>
    <Header />
    <section class="page-hero">
      <h1>Katalog Solusi Pétung</h1>
      <p>
        6 aliran pendapatan, banyak outcome — dari kartu weton gratis sampai paket hajat
        lengkap. Semua bersumber dari satu mesin perhitungan yang dapat diaudit.
      </p>
    </section>

    <section class="section">
      {STREAMS.map((stream) => {
        const items = SOLUTIONS.filter((s) => s.stream === stream.id)
        if (items.length === 0) return null
        return (
          <div class="stream-block">
            <h2 class="stream-title">
              <span class="stream-tag">{stream.id}</span> {stream.label}
            </h2>
            <div class="solusi-grid">
              {items.map((s) => (
                <article class="solusi-card">
                  {s.badge && <span class="card-badge">{s.badge}</span>}
                  <h3>{s.nama}</h3>
                  <p class="card-promise">{s.promise}</p>
                  <div class="card-price">
                    <span class="price-pending">
                      <i class="fas fa-tag"></i> Harga menunggu konfirmasi
                    </span>
                    <small>Usulan: {s.priceDraft}</small>
                  </div>
                  <div class="card-actions">
                    <a href={`/petung/${s.slug}`} class="btn btn-outline btn-sm">
                      Detail
                    </a>
                    {s.toolPath && (
                      <a href={s.toolPath} class="btn btn-primary btn-sm">
                        Coba Tool
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )
      })}
    </section>
    <Footer />
  </>
)

export const PetungDetail = ({ solution }: { solution: Solution }) => {
  const s = solution
  return (
    <>
      <Header />
      <section class="page-hero detail-hero">
        <span class="hero-eyebrow">{s.streamLabel}</span>
        <h1>{s.nama}</h1>
        <p class="detail-promise">{s.promise}</p>
        {s.toolPath && (
          <a href={s.toolPath} class="btn btn-primary btn-lg">
            <i class="fas fa-play"></i> Coba tool sekarang
          </a>
        )}
      </section>

      <section class="section detail-body">
        <div class="detail-main">
          <div class="detail-card">
            <h3><i class="fas fa-circle-question"></i> Masalah yang diselesaikan</h3>
            <p>{s.problem}</p>
          </div>

          <div class="detail-card">
            <h3><i class="fas fa-gift"></i> Yang kamu dapatkan</h3>
            <ul class="card-outcomes">
              {s.outcomes.map((o) => (
                <li><i class="fas fa-check"></i> {o}</li>
              ))}
            </ul>
          </div>

          <div class="detail-card">
            <h3><i class="fas fa-layer-group"></i> Pilihan paket (tangga harga)</h3>
            <div class="plans-table">
              {s.plans.map((p) => (
                <div class="plan-row">
                  <span class="plan-mode">{p.mode}</span>
                  <div class="plan-info">
                    <strong>{p.label}</strong>
                    <small>{p.isi}</small>
                  </div>
                  <span class="plan-price">{p.priceDraft}</span>
                  <a
                    href={`/petung/checkout/${s.slug}?plan=${p.mode}`}
                    class="btn btn-primary btn-sm plan-buy"
                  >
                    <i class="fas fa-qrcode"></i> Pesan
                  </a>
                </div>
              ))}
            </div>
            <p class="price-note">
              <i class="fas fa-triangle-exclamation"></i> Harga di atas adalah{' '}
              <strong>usulan/draft</strong> dan menunggu konfirmasi final. Hubungi kami
              untuk penawaran resmi.
            </p>
          </div>
        </div>

        <aside class="detail-side">
          <div class="side-card">
            <h4>Value-metric (yang dibayar)</h4>
            <p>{s.valueMetric}</p>
            <hr />
            <h4>ICP</h4>
            <p>{s.icp}</p>
            <hr />
            <h4>Mesin (skill)</h4>
            <div class="skill-tags">
              {s.engineSkills.map((sk) => (
                <span class="skill-tag">{sk}</span>
              ))}
            </div>
            <a href={`/petung/checkout/${s.slug}`} class="btn btn-primary btn-block" style="margin-top:1rem">
              <i class="fas fa-qrcode"></i> Pesan & Bayar (QRIS/VA)
            </a>
            <a href="/petung/intake" class="btn btn-outline btn-block" style="margin-top:.5rem">
              <i class="fas fa-paper-plane"></i> Konsultasi dulu
            </a>
          </div>
          <TrustStrip />
        </aside>
      </section>

      <section class="section">
        <DisclaimerBox />
      </section>
      <Footer />
    </>
  )
}
