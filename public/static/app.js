// ════════════════════════════════════════════════════════════════════
// app.js — Frontend Pétung: hubungkan tools ke API mesin-pétung
// ════════════════════════════════════════════════════════════════════
'use strict'

const $ = (id) => document.getElementById(id)

async function apiGet(path) {
  const res = await fetch(path)
  return res.json()
}

function show(el, html) {
  el.innerHTML = html
  el.hidden = false
}

function errBox(msg) {
  return `<p class="result-error"><i class="fas fa-circle-exclamation"></i> ${msg}</p>`
}

function wetonStats(w, watak) {
  return `
    <div class="result-title"><span class="weton-badge"><i class="fas fa-star-and-crescent"></i> ${w.hari} ${w.pasaran}</span></div>
    <div class="result-grid">
      <div class="result-stat"><div class="lbl">Neptu Hari</div><div class="val">${w.neptuHari}</div></div>
      <div class="result-stat"><div class="lbl">Neptu Pasaran</div><div class="val">${w.neptuPasaran}</div></div>
      <div class="result-stat"><div class="lbl">Total Neptu</div><div class="val">${w.neptu}</div></div>
    </div>
    ${watak ? `<div class="result-tafsir">${watak}</div>` : ''}
  `
}

function disclaimerLine(sumber) {
  return `<p class="result-sumber"><i class="fas fa-circle-info"></i> ${sumber || 'Edukasi-budaya, bukan kepastian.'}</p>`
}

// ── Hero quick widget ──
function bindHero() {
  const btn = $('hero-cek-btn')
  if (!btn) return
  btn.addEventListener('click', async () => {
    const tgl = $('hero-tgl').value
    const out = $('hero-weton-result')
    if (!tgl) return show(out, errBox('Pilih tanggal lahir dulu.'))
    btn.disabled = true
    const r = await apiGet(`/api/weton?tgl=${tgl}`)
    btn.disabled = false
    if (!r.ok) return show(out, errBox(r.error))
    show(
      out,
      wetonStats(r.weton, r.watak) +
        `<div class="cta-after"><a href="/petung/cek" class="btn btn-outline btn-sm">Lihat detail & watak →</a></div>`
    )
  })
}

// ── Cek Weton tool ──
function bindCekWeton() {
  const btn = $('btn-cek-weton')
  if (!btn) return
  btn.addEventListener('click', async () => {
    const tgl = $('tgl-lahir').value
    const out = $('hasil-weton')
    if (!tgl) return show(out, errBox('Pilih tanggal lahir dulu.'))
    btn.disabled = true
    const r = await apiGet(`/api/weton?tgl=${tgl}`)
    btn.disabled = false
    if (!r.ok) return show(out, errBox(r.error))
    const kartuUrl = `/artefak/kartu-weton?tgl=${encodeURIComponent(tgl)}`
    show(
      out,
      wetonStats(r.weton, r.watak) +
        disclaimerLine(
          'Watak & neptu menurut tradisi primbon Jawa — bersifat edukasi-budaya, bukan kepastian.'
        ) +
        `<div class="cta-after">
           <a href="${kartuUrl}" target="_blank" rel="noopener" class="btn btn-primary btn-sm"><i class="fas fa-id-card"></i> Buat & Unduh Kartu Weton</a>
           <a href="/petung/jodoh" class="btn btn-outline btn-sm">Cek Kecocokan</a>
         </div>`
    )
  })
}

// ── Cek Jodoh tool ──
function bindCekJodoh() {
  const btn = $('btn-cek-jodoh')
  if (!btn) return
  btn.addEventListener('click', async () => {
    const a = $('tgl-a').value
    const b = $('tgl-b').value
    const out = $('hasil-jodoh')
    if (!a || !b) return show(out, errBox('Isi kedua tanggal lahir.'))
    btn.disabled = true
    const r = await apiGet(`/api/jodoh?a=${a}&b=${b}`)
    btn.disabled = false
    if (!r.ok) return show(out, errBox(r.error))
    show(
      out,
      `<div class="result-title">Hasil Kecocokan: <span class="neptu-pill">${r.hasil.nama}</span></div>
       <div class="result-grid">
         <div class="result-stat"><div class="lbl">Weton 1</div><div class="val" style="font-size:.95rem">${r.wetonA.hari} ${r.wetonA.pasaran}</div></div>
         <div class="result-stat"><div class="lbl">Weton 2</div><div class="val" style="font-size:.95rem">${r.wetonB.hari} ${r.wetonB.pasaran}</div></div>
         <div class="result-stat"><div class="lbl">Total Neptu</div><div class="val">${r.hasil.total}</div></div>
       </div>
       <div class="result-tafsir">${r.hasil.tafsir}</div>
       ${disclaimerLine(r.hasil.sumber)}
       <div class="cta-after"><a href="/petung/petung-pengantin" class="btn btn-primary btn-sm"><i class="fas fa-ring"></i> Pétung Pengantin</a></div>`
    )
  })
}

// ── Hari Baik tool ──
function bindHariBaik() {
  const btn = $('btn-hari-baik')
  if (!btn) return
  btn.addEventListener('click', async () => {
    const tgl = $('tgl-lahir-hb').value
    const mulai = $('tgl-mulai').value
    const selesai = $('tgl-selesai').value
    const out = $('hasil-hari-baik')
    if (!tgl || !mulai || !selesai)
      return show(out, errBox('Isi tanggal lahir & rentang pencarian.'))
    btn.disabled = true
    const r = await apiGet(
      `/api/hari-baik?tgl=${tgl}&mulai=${mulai}&selesai=${selesai}&jumlah=7`
    )
    btn.disabled = false
    if (!r.ok) return show(out, errBox(r.error))
    if (!r.kandidat.length)
      return show(
        out,
        errBox('Tidak ada tanggal yang memenuhi kriteria di rentang ini. Coba perluas rentang.')
      )
    const items = r.kandidat
      .map(
        (h) => `<li>
          <div><div class="hb-date"><i class="fas fa-calendar-day"></i> ${formatTgl(h.tanggal)}</div>
          <div class="hb-weton">${h.hari} ${h.pasaran} · neptu ${h.neptu}</div></div>
          <small class="hb-weton" style="max-width:55%">${h.alasan}</small>
        </li>`
      )
      .join('')
    const kalUrl =
      `/artefak/kalender?tgl=${encodeURIComponent(tgl)}` +
      `&mulai=${encodeURIComponent(mulai)}&selesai=${encodeURIComponent(selesai)}&jumlah=7`
    show(
      out,
      `<div class="result-title">Hari baik untukmu (${r.kandidat.length})</div>
       <ul class="hari-baik-list">${items}</ul>
       ${disclaimerLine(r.sumber)}
       <div class="cta-after">
         <a href="${kalUrl}" target="_blank" rel="noopener" class="btn btn-primary btn-sm"><i class="fas fa-file-pdf"></i> Unduh Kalender Hari Baik (PDF)</a>
         <a href="/petung/checkout/petung-pengantin" class="btn btn-outline btn-sm">Pesan Pétung Pengantin →</a>
       </div>`
    )
  })
}

// ── Nama Usaha tool ──
function bindNamaUsaha() {
  const btn = $('btn-nama-usaha')
  if (!btn) return
  btn.addEventListener('click', async () => {
    const tgl = $('tgl-lahir-nu').value
    const kata = $('kata-dasar').value || 'Usaha'
    const out = $('hasil-nama-usaha')
    if (!tgl) return show(out, errBox('Isi tanggal lahir pemilik usaha.'))
    btn.disabled = true
    const r = await apiGet(`/api/nama-usaha?tgl=${tgl}&kata=${encodeURIComponent(kata)}`)
    btn.disabled = false
    if (!r.ok) return show(out, errBox(r.error))
    const chips = r.usulan.map((n) => `<span class="nama-chip">${n}</span>`).join('')
    show(
      out,
      `<div class="result-title">Usulan nama selaras weton <span class="hb-weton">(${r.weton.hari} ${r.weton.pasaran})</span></div>
       <div style="margin:.5rem 0">${chips}</div>
       ${disclaimerLine('Usulan selaras weton menurut tradisi. Pilihan tetap di tanganmu — bukan jaminan laris.')}
       <div class="cta-after"><a href="/petung/petung-usaha" class="btn btn-primary btn-sm">Pétung Usaha →</a></div>`
    )
  })
}

// ── Intake ──
function bindIntake() {
  const btn = $('btn-intake')
  if (!btn) return
  btn.addEventListener('click', async () => {
    const out = $('hasil-intake')
    const payload = {
      nama: $('nama').value,
      hajat: $('hajat').value,
      kontak: $('kontak').value,
      catatan: $('catatan').value,
    }
    if (!payload.nama || !payload.kontak)
      return show(out, errBox('Nama & kontak wajib diisi.'))
    btn.disabled = true
    const res = await fetch('/api/intake', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const r = await res.json()
    btn.disabled = false
    if (!r.ok) return show(out, errBox(r.error))
    show(out, `<p><i class="fas fa-circle-check" style="color:var(--hijau)"></i> ${r.message}</p>`)
  })
}

function formatTgl(iso) {
  const [y, m, d] = iso.split('-')
  const bln = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des']
  return `${Number(d)} ${bln[Number(m) - 1]} ${y}`
}

// ── Checkout (MoR Duitku POP) ──
function bindCheckout() {
  const btn = $('btn-checkout')
  if (!btn) return
  btn.addEventListener('click', async () => {
    const out = $('checkout-result')
    const payload = {
      slug: $('co-slug').value,
      plan: $('co-plan').value,
      nama: $('co-nama').value.trim(),
      email: $('co-email').value.trim(),
      phone: ($('co-phone').value || '').trim(),
      amount: Number($('co-amount').value),
    }
    if (!payload.nama || !payload.email)
      return show(out, errBox('Nama & email wajib diisi.'))
    if (!payload.amount || payload.amount < 10000)
      return show(out, errBox('Nominal minimal Rp 10.000.'))

    btn.disabled = true
    show(out, `<p><i class="fas fa-spinner fa-spin"></i> Membuat invoice pembayaran...</p>`)
    let r
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      r = await res.json()
    } catch (e) {
      btn.disabled = false
      return show(out, errBox('Gagal menghubungi server pembayaran.'))
    }
    if (!r.ok) {
      btn.disabled = false
      return show(out, errBox(r.error || 'Gagal membuat invoice.'))
    }

    // Tampilkan info order + jalankan Duitku POP JS
    show(
      out,
      `<p><i class="fas fa-circle-check" style="color:var(--hijau)"></i> Invoice dibuat.
        No. Order: <strong>${r.merchantOrderId}</strong></p>
       <p class="hb-weton">Membuka jendela pembayaran Duitku (QRIS / VA / e-wallet)...</p>`
    )

    if (typeof checkout !== 'undefined' && checkout.process) {
      checkout.process(r.reference, {
        defaultLanguage: 'id',
        successEvent: function () {
          window.location.href = `/petung/pembayaran/return?merchantOrderId=${encodeURIComponent(r.merchantOrderId)}&reference=${encodeURIComponent(r.reference)}&resultCode=00`
        },
        pendingEvent: function () {
          window.location.href = `/petung/pembayaran/return?merchantOrderId=${encodeURIComponent(r.merchantOrderId)}&reference=${encodeURIComponent(r.reference)}&resultCode=01`
        },
        errorEvent: function () {
          btn.disabled = false
          show(out, errBox('Terjadi kesalahan saat memproses pembayaran. Coba lagi.'))
        },
        closeEvent: function () {
          btn.disabled = false
          show(
            out,
            `<p><i class="fas fa-circle-info"></i> Jendela pembayaran ditutup. Order
             <strong>${r.merchantOrderId}</strong> masih menunggu pembayaran.</p>
             <div class="cta-after"><a href="/petung/pembayaran/return?merchantOrderId=${encodeURIComponent(r.merchantOrderId)}&reference=${encodeURIComponent(r.reference)}" class="btn btn-outline btn-sm">Cek status order</a></div>`
          )
        },
      })
    } else if (r.paymentUrl) {
      // Fallback: window redirection bila duitku.js tidak termuat
      window.location.href = r.paymentUrl
    } else {
      btn.disabled = false
      show(out, errBox('Modul pembayaran tidak termuat. Muat ulang halaman & coba lagi.'))
    }
  })
}

// ── Halaman return: polling status order ──
function bindReturnStatus() {
  const card = document.querySelector('[data-return]')
  if (!card) return
  const moid = card.getAttribute('data-return')
  if (!moid) return
  const titleEl = $('return-title')
  const msgEl = $('return-msg')
  const statusEl = $('return-status')
  let tries = 0
  const poll = async () => {
    tries++
    try {
      const res = await fetch(`/api/order/${encodeURIComponent(moid)}`)
      const r = await res.json()
      if (r.ok && r.order) {
        const st = r.order.status
        if (statusEl) statusEl.textContent = st.toUpperCase()
        if (st === 'paid') {
          if (titleEl) titleEl.textContent = 'Pembayaran Berhasil'
          if (msgEl) msgEl.textContent = 'Terima kasih! Pesananmu sedang kami proses menjadi artefak.'
          return
        }
        if (st === 'failed') {
          if (titleEl) titleEl.textContent = 'Pembayaran Gagal'
          if (msgEl) msgEl.textContent = 'Pembayaran tidak berhasil. Silakan coba lagi atau hubungi kami.'
          return
        }
      }
    } catch (e) {}
    if (tries < 20) setTimeout(poll, 3000) // poll s.d. ~60 detik
  }
  poll()
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  bindHero()
  bindCekWeton()
  bindCekJodoh()
  bindHariBaik()
  bindNamaUsaha()
  bindIntake()
  bindCheckout()
  bindReturnStatus()
})
