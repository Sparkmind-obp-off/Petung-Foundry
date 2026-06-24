// ════════════════════════════════════════════════════════════════════════
// artefak.ts — Render artefak budaya (Kartu Weton & Kalender Hari Baik)
// SSOT: B9-05 §5 (Proof-of-Outcome: file artefak + disclaimer wajib tampil)
//       B9-04 §3 (disclaimer kanonik WAJIB menempel pada artefak yang dibagikan)
//
// Strategi edge-native (NO lib PDF berat di Worker): render HTML artefak yang
// "print-ready" (CSS @media print + @page). Pengguna klik "Unduh PDF" → browser
// print-to-PDF (window.print()). 100% client-side render, COGS ~0.
// Setiap artefak WAJIB menempelkan disclaimer kanonik (Truth-Lock).
// ════════════════════════════════════════════════════════════════════════

import type { Weton, HariBaik } from './petung'
import { DISCLAIMER_KANONIK, DISCLAIMER_MICRO, SUMBER_METODE } from './petung-data'

// Palet earthy-Jawa (B9-02 §6)
const C = {
  sogan: '#7B4B2A',
  emas: '#C9A24B',
  hijau: '#2E4034',
  krem: '#F4ECDD',
}

function escapeHtml(s: string): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function formatTglID(iso: string): string {
  const [y, m, d] = iso.split('-')
  const bln = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ]
  return `${Number(d)} ${bln[Number(m) - 1]} ${y}`
}

const printShell = (title: string, inner: string) => `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(title)}</title>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
<style>
  :root{--sogan:${C.sogan};--emas:${C.emas};--hijau:${C.hijau};--krem:${C.krem}}
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Inter',system-ui,sans-serif;background:#e8e2d4;color:#26201a;padding:2rem 1rem;display:flex;flex-direction:column;align-items:center;gap:1.25rem}
  .toolbar{display:flex;gap:.6rem;flex-wrap:wrap;justify-content:center}
  .btn{cursor:pointer;border:none;border-radius:.6rem;padding:.7rem 1.4rem;font-weight:600;font-size:.95rem;display:inline-flex;align-items:center;gap:.5rem;text-decoration:none}
  .btn-primary{background:var(--hijau);color:var(--krem)}
  .btn-outline{background:transparent;border:1.5px solid var(--hijau);color:var(--hijau)}
  .disclaimer{font-size:.72rem;color:#5a5145;max-width:520px;text-align:center;line-height:1.45;border-top:1px dashed #b9ad96;padding-top:.6rem}
  @media print{
    body{background:#fff;padding:0}
    .toolbar,.no-print{display:none !important}
    @page{margin:12mm}
  }
  ${inner.split('<!--STYLE-->')[1] ?? ''}
</style>
</head>
<body>
  <div class="toolbar no-print">
    <button class="btn btn-primary" onclick="window.print()"><i class="fas fa-download"></i> Unduh / Cetak PDF</button>
    <a class="btn btn-outline" href="/petung">← Kembali</a>
  </div>
  ${inner.split('<!--STYLE-->')[0]}
</body>
</html>`

// ────────────────────────────────────────────────────────────────────────
// 1. Kartu Weton (artefak shareable — S1 tripwire)
// ────────────────────────────────────────────────────────────────────────
export function renderKartuWeton(opts: {
  nama?: string
  weton: Weton
  watak: string
}): string {
  const { weton: w, watak } = opts
  const nama = escapeHtml(opts.nama || 'Sahabat Pétung')
  const card = `
  <article class="kartu">
    <div class="kartu-head">
      <span class="kartu-brand"><i class="fas fa-compass-drafting"></i> Pétung</span>
      <span class="kartu-sub">Kartu Weton</span>
    </div>
    <div class="kartu-nama">${nama}</div>
    <div class="kartu-weton">${escapeHtml(w.hari)} ${escapeHtml(w.pasaran)}</div>
    <div class="kartu-lahir">Lahir: ${formatTglID(w.tanggal)}</div>
    <div class="kartu-neptu">
      <div><span>${w.neptuHari}</span><small>Neptu Hari</small></div>
      <div class="plus">+</div>
      <div><span>${w.neptuPasaran}</span><small>Neptu Pasaran</small></div>
      <div class="eq">=</div>
      <div class="total"><span>${w.neptu}</span><small>Total Neptu</small></div>
    </div>
    <p class="kartu-watak">${escapeHtml(watak)}</p>
    <div class="kartu-foot">${escapeHtml(DISCLAIMER_MICRO)}</div>
  </article>
  <p class="disclaimer">${escapeHtml(DISCLAIMER_KANONIK)}</p>
<!--STYLE-->
  .kartu{width:340px;background:linear-gradient(155deg,var(--hijau),#1d2a22);color:var(--krem);border-radius:1.2rem;padding:1.8rem;box-shadow:0 12px 40px rgba(0,0,0,.25);border:2px solid var(--emas);position:relative;overflow:hidden}
  .kartu::after{content:'';position:absolute;right:-40px;top:-40px;width:140px;height:140px;border:2px solid var(--emas);border-radius:50%;opacity:.25}
  .kartu-head{display:flex;justify-content:space-between;align-items:center;font-size:.8rem;letter-spacing:.05em}
  .kartu-brand{color:var(--emas);font-weight:700}
  .kartu-sub{opacity:.8;text-transform:uppercase}
  .kartu-nama{font-size:1.3rem;font-weight:700;margin-top:1.2rem}
  .kartu-weton{font-family:Georgia,serif;font-size:2rem;color:var(--emas);margin:.2rem 0}
  .kartu-lahir{font-size:.82rem;opacity:.85;margin-bottom:1.2rem}
  .kartu-neptu{display:flex;align-items:center;gap:.5rem;background:rgba(255,255,255,.07);border-radius:.8rem;padding:.9rem;margin-bottom:1rem}
  .kartu-neptu>div{display:flex;flex-direction:column;align-items:center;flex:1}
  .kartu-neptu span{font-size:1.5rem;font-weight:700}
  .kartu-neptu small{font-size:.6rem;opacity:.75;text-align:center}
  .kartu-neptu .plus,.kartu-neptu .eq{flex:0;font-size:1.1rem;opacity:.6}
  .kartu-neptu .total span{color:var(--emas)}
  .kartu-watak{font-size:.88rem;line-height:1.5;opacity:.95}
  .kartu-foot{margin-top:1.2rem;font-size:.62rem;opacity:.7;border-top:1px solid rgba(201,162,75,.4);padding-top:.6rem}
  `
  return printShell(`Kartu Weton ${nama} — Pétung`, card)
}

// ────────────────────────────────────────────────────────────────────────
// 2. Kalender Hari Baik (artefak utama — Pétung Pengantin/Hajat/Usaha)
// ────────────────────────────────────────────────────────────────────────
export function renderKalenderHariBaik(opts: {
  nama?: string
  judul?: string
  weton: Weton
  kandidat: HariBaik[]
}): string {
  const { weton: w, kandidat } = opts
  const nama = escapeHtml(opts.nama || 'Sahabat Pétung')
  const judul = escapeHtml(opts.judul || 'Kalender Hari Baik')
  const rows = kandidat
    .map(
      (h, i) => `
      <tr>
        <td class="rank">${i + 1}</td>
        <td><strong>${formatTglID(h.tanggal)}</strong></td>
        <td>${escapeHtml(h.hari)} ${escapeHtml(h.pasaran)}</td>
        <td class="neptu-cell">${h.neptu}</td>
        <td class="alasan">${escapeHtml(h.alasan)}</td>
      </tr>`
    )
    .join('')
  const doc = `
  <article class="kalender">
    <header class="kal-head">
      <div class="kal-brand"><i class="fas fa-compass-drafting"></i> Pétung <small>by SparkMind</small></div>
      <h1>${judul}</h1>
      <p class="kal-sub">Disusun untuk <strong>${nama}</strong> · Weton: <strong>${escapeHtml(w.hari)} ${escapeHtml(w.pasaran)}</strong> (neptu ${w.neptu})</p>
    </header>
    <table class="kal-table">
      <thead><tr><th>#</th><th>Tanggal</th><th>Weton</th><th>Neptu</th><th>Catatan tradisi</th></tr></thead>
      <tbody>${rows || '<tr><td colspan="5" style="text-align:center;padding:1.5rem">Tidak ada kandidat hari baik pada rentang ini.</td></tr>'}</tbody>
    </table>
    <p class="kal-sumber"><i class="fas fa-circle-info"></i> ${escapeHtml(SUMBER_METODE)}</p>
    <p class="disclaimer">${escapeHtml(DISCLAIMER_KANONIK)}</p>
    <footer class="kal-foot">${escapeHtml(DISCLAIMER_MICRO)} · petung.id</footer>
  </article>
<!--STYLE-->
  .kalender{width:100%;max-width:760px;background:#fff;border-radius:1rem;padding:2rem;box-shadow:0 10px 36px rgba(0,0,0,.12);border-top:6px solid var(--emas)}
  .kal-head{text-align:center;border-bottom:2px solid var(--krem);padding-bottom:1rem;margin-bottom:1.2rem}
  .kal-brand{color:var(--hijau);font-weight:700;font-size:1.1rem}
  .kal-brand small{color:var(--sogan);font-weight:500;font-size:.7rem}
  .kal-head h1{font-family:Georgia,serif;color:var(--sogan);font-size:1.7rem;margin:.5rem 0}
  .kal-sub{font-size:.9rem;color:#5a5145}
  .kal-table{width:100%;border-collapse:collapse;font-size:.88rem}
  .kal-table th{background:var(--hijau);color:var(--krem);padding:.6rem;text-align:left;font-size:.78rem}
  .kal-table td{padding:.6rem;border-bottom:1px solid #ece5d6;vertical-align:top}
  .kal-table tr:nth-child(even) td{background:#faf6ec}
  .rank{font-weight:700;color:var(--emas);text-align:center;width:32px}
  .neptu-cell{font-weight:700;color:var(--sogan);text-align:center}
  .alasan{font-size:.78rem;color:#6a6155}
  .kal-sumber{font-size:.72rem;color:#6a6155;margin-top:1rem;background:#faf6ec;padding:.6rem;border-radius:.5rem}
  .kal-foot{margin-top:1rem;text-align:center;font-size:.68rem;color:#8a8170;letter-spacing:.03em}
  `
  return printShell(`${judul} — ${nama} — Pétung`, doc)
}
