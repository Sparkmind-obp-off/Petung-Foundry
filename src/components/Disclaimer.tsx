// ════════════════════════════════════════════════════════════════════════
// Disclaimer.tsx — Komponen disclaimer wajib (Truth-Lock B9-04 §3)
// WAJIB tampil di: footer, halaman hasil, sebelum checkout, & pada artefak.
// ════════════════════════════════════════════════════════════════════════
import { DISCLAIMER_KANONIK, DISCLAIMER_MICRO } from '../lib/petung-data'

export const DisclaimerBox = () => (
  <aside
    id="disclaimer-budaya"
    class="disclaimer-box"
    role="note"
    aria-label="Disclaimer edukasi budaya"
  >
    <i class="fas fa-circle-info" aria-hidden="true"></i>
    <p>{DISCLAIMER_KANONIK}</p>
  </aside>
)

export const DisclaimerMicro = () => (
  <span class="disclaimer-micro">{DISCLAIMER_MICRO}</span>
)

export const TrustStrip = () => (
  <div class="trust-strip" aria-label="Trust strip">
    <span><i class="fas fa-shield-halved"></i> Edukasi-budaya · Truth-Lock</span>
    <span><i class="fas fa-qrcode"></i> Bayar QRIS / VA (MoR Oasis BI Pro)</span>
    <span><i class="fas fa-user-shield"></i> Patuh UU PDP — data lahir disimpan minimal</span>
    <span><i class="fas fa-heart"></i> Menghormati semua keyakinan</span>
  </div>
)
