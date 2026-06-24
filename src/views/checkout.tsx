// ════════════════════════════════════════════════════════════════════════
// checkout.tsx — Halaman checkout (MoR Duitku POP) + halaman return
// SSOT: B9-05 F2 PAY · B9-04 §3 (disclaimer sebelum checkout WAJIB)
//
// ⚠️ Truth-Lock harga (B9-03 §11 + R6-4): priceIdr = null sampai HITL pricing.
// Untuk SKU yang priceIdr masih null → tampilkan input nominal manual + catatan
// "harga menunggu konfirmasi". Duitku POP JS dipakai untuk QRIS/VA.
// ════════════════════════════════════════════════════════════════════════
import { Header, Footer } from './layout'
import { DisclaimerBox, TrustStrip } from '../components/Disclaimer'
import type { Solution } from '../data/solutions'

export const CheckoutPage = ({
  solution,
  planMode,
  duitkuConfigured,
  duitkuJs,
}: {
  solution: Solution
  planMode: string
  duitkuConfigured: boolean
  duitkuJs: string
}) => {
  const s = solution
  const plan = s.plans.find((p) => p.mode === planMode) ?? s.plans[0]
  return (
    <>
      <Header />
      {/* duitku.js (POP) — di-load di halaman checkout saja */}
      <script src={duitkuJs}></script>

      <section class="page-hero tool-hero">
        <span class="hero-eyebrow">Checkout · MoR Oasis BI Pro (Duitku)</span>
        <h1>Pesan: {s.nama}</h1>
        <p>Bayar mudah via QRIS / Virtual Account / e-wallet. Aman & instan.</p>
      </section>

      <section class="section tool-section">
        <div class="checkout-grid">
          <div class="tool-card" data-checkout={s.slug}>
            {!duitkuConfigured && (
              <div class="checkout-warn" role="alert">
                <i class="fas fa-triangle-exclamation"></i> Mode pratinjau: gerbang pembayaran
                belum dikonfigurasi pada environment ini. Form tetap bisa dicoba; transaksi
                nyata aktif setelah secret Duitku di-set.
              </div>
            )}

            <h3 class="co-title"><i class="fas fa-receipt"></i> Detail Pesanan</h3>
            <div class="co-summary">
              <div class="co-row"><span>Produk</span><strong>{s.nama}</strong></div>
              <div class="co-row"><span>Paket</span><strong>{plan?.label ?? '-'} ({plan?.mode})</strong></div>
              <div class="co-row"><span>Isi</span><span class="co-isi">{plan?.isi}</span></div>
              <div class="co-row"><span>Harga usulan</span><span>{plan?.priceDraft}</span></div>
            </div>

            <p class="price-note">
              <i class="fas fa-circle-info"></i> Harga produk ini masih{' '}
              <strong>usulan/draft (menunggu konfirmasi HITL)</strong>. Untuk demo pembayaran,
              masukkan nominal yang disepakati (min Rp 10.000).
            </p>

            <label for="co-nama">Nama lengkap</label>
            <input type="text" id="co-nama" class="input" placeholder="Nama kamu" />

            <label for="co-email">Email</label>
            <input type="email" id="co-email" class="input" placeholder="email@contoh.com" />

            <label for="co-phone">No. WhatsApp (opsional)</label>
            <input type="text" id="co-phone" class="input" placeholder="08xxxxxxxxxx" />

            <label for="co-amount">Nominal pembayaran (Rp)</label>
            <input
              type="number"
              id="co-amount"
              class="input"
              min="10000"
              step="1000"
              value="99000"
              placeholder="cth: 99000"
            />

            <input type="hidden" id="co-slug" value={s.slug} />
            <input type="hidden" id="co-plan" value={plan?.mode ?? ''} />

            <DisclaimerBeforePay />

            <button id="btn-checkout" class="btn btn-primary btn-block btn-lg" style="margin-top:1rem">
              <i class="fas fa-qrcode"></i> Bayar Sekarang (QRIS / VA)
            </button>
            <div id="checkout-result" class="tool-result" hidden></div>
          </div>

          <aside class="detail-side">
            <div class="side-card">
              <h4>Yang kamu dapatkan</h4>
              <ul class="card-outcomes">
                {s.outcomes.map((o) => (
                  <li><i class="fas fa-check"></i> {o}</li>
                ))}
              </ul>
              <hr />
              <h4>Value-metric</h4>
              <p>{s.valueMetric}</p>
            </div>
            <TrustStrip />
          </aside>
        </div>
      </section>

      <section class="section">
        <DisclaimerBox />
      </section>
      <Footer />
    </>
  )
}

const DisclaimerBeforePay = () => (
  <div class="checkout-disclaimer" role="note">
    <i class="fas fa-shield-halved"></i>
    <p>
      Dengan melanjutkan, kamu memahami bahwa Pétung menjual <strong>artefak budaya yang rapi
      & dipersonalisasi sebagai edukasi-budaya</strong> — bukan jaminan nasib. Pembayaran
      diproses oleh <strong>MoR Oasis BI Pro (Duitku)</strong>. Data lahir disimpan minimal
      (UU PDP) dan bisa dihapus atas permintaan.
    </p>
  </div>
)

// ── Halaman return setelah pembayaran ──
export const PaymentReturnPage = ({
  merchantOrderId,
  reference,
  resultCode,
}: {
  merchantOrderId: string
  reference: string
  resultCode: string
}) => {
  const sukses = resultCode === '00'
  return (
    <>
      <Header />
      <section class="section" style="min-height:50vh;display:flex;align-items:center;justify-content:center">
        <div class="tool-card" style="max-width:520px;text-align:center" data-return={merchantOrderId}>
          <div class={`return-icon ${sukses ? 'ok' : resultCode ? 'fail' : 'pending'}`}>
            <i class={`fas ${sukses ? 'fa-circle-check' : resultCode ? 'fa-circle-xmark' : 'fa-clock'}`}></i>
          </div>
          <h2 id="return-title">
            {sukses ? 'Pembayaran Berhasil' : resultCode ? 'Pembayaran Belum Selesai' : 'Memeriksa Status...'}
          </h2>
          <p id="return-msg" class="hb-weton">
            {sukses
              ? 'Terima kasih! Pesananmu sedang kami proses untuk dirakit menjadi artefak.'
              : 'Jika kamu sudah membayar, status akan diperbarui otomatis.'}
          </p>
          <div class="co-summary" style="margin:1rem 0;text-align:left">
            {merchantOrderId && (
              <div class="co-row"><span>No. Order</span><strong>{merchantOrderId}</strong></div>
            )}
            {reference && (
              <div class="co-row"><span>Referensi</span><strong>{reference}</strong></div>
            )}
            <div class="co-row"><span>Status</span><strong id="return-status">{sukses ? 'LUNAS' : resultCode ? 'GAGAL/PENDING' : 'CEK...'}</strong></div>
          </div>
          <div class="cta-after">
            <a href="/petung" class="btn btn-outline btn-sm">← Katalog</a>
            <a href="/petung/intake" class="btn btn-primary btn-sm">Butuh bantuan? Hubungi kami</a>
          </div>
          <p class="disclaimer-micro" style="margin-top:1rem">Edukasi-budaya, bukan kepastian. — Pétung by SparkMind</p>
        </div>
      </section>
      <Footer />
    </>
  )
}
