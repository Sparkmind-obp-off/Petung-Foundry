// ════════════════════════════════════════════════════════════════════════
// index.tsx — Pétung Foundry · entry point (Hono + Cloudflare Pages)
// SSOT: B9-05 (blueprint webapp) · routes /petung + tools + API deterministik
//       + checkout MoR Duitku POP (F2 PAY) + artefak PDF + persistensi D1.
// ════════════════════════════════════════════════════════════════════════
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { renderer } from './renderer'

import { PetungHome } from './views/home'
import { PetungCatalog, PetungDetail } from './views/petung'
import {
  CekWetonTool,
  CekJodohTool,
  HariBaikTool,
  NamaUsahaTool,
  IntakePage,
} from './views/tools'
import { CheckoutPage, PaymentReturnPage } from './views/checkout'
import { getSolution } from './data/solutions'

import {
  getWeton,
  watakWeton,
  cekKecocokan,
  cariHariBaik,
  usulNamaUsaha,
  parseTanggal,
} from './lib/petung'
import {
  getDuitkuConfig,
  createInvoice,
  verifyCallbackSignature,
  genMerchantOrderId,
  duitkuJsUrl,
} from './lib/duitku'
import { renderKartuWeton, renderKalenderHariBaik } from './lib/artefak'

type Bindings = {
  DB?: D1Database
  DUITKU_MERCHANT_CODE?: string
  DUITKU_API_KEY?: string
  DUITKU_ENV?: string
}

const app = new Hono<{ Bindings: Bindings }>()

// Static assets
app.use('/static/*', serveStatic({ root: './public' }))

// Favicon (SVG inline — siklus weton 7+5, B9-02 §6 simbol perhitungan→hasil)
app.get('/favicon.ico', (c) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#2E4034"/><circle cx="32" cy="32" r="18" fill="none" stroke="#C9A24B" stroke-width="3"/><circle cx="32" cy="14" r="4" fill="#7B4B2A"/><text x="32" y="40" font-size="20" font-family="Georgia,serif" fill="#F4ECDD" text-anchor="middle" font-weight="bold">P</text></svg>`
  return c.body(svg, 200, { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=86400' })
})

// Renderer (layout HTML)
app.use(renderer)

// ── Halaman publik ──
app.get('/', (c) => c.render(<PetungHome />, { title: 'Pétung — Hari Baik & Weton, Outcome Foundry Budaya Jawa' }))

app.get('/petung', (c) => c.render(<PetungCatalog />, { title: 'Katalog Solusi · Pétung' }))

// Tools (route spesifik HARUS sebelum :slug)
app.get('/petung/cek', (c) => c.render(<CekWetonTool />, { title: 'Cek Weton · Pétung' }))
app.get('/petung/jodoh', (c) => c.render(<CekJodohTool />, { title: 'Cek Kecocokan · Pétung' }))
app.get('/petung/hari-baik', (c) => c.render(<HariBaikTool />, { title: 'Cari Hari Baik · Pétung' }))
app.get('/petung/nama-usaha', (c) => c.render(<NamaUsahaTool />, { title: 'Usul Nama Usaha · Pétung' }))
app.get('/petung/intake', (c) => c.render(<IntakePage />, { title: 'Konsultasi · Pétung' }))

// ── Checkout (MoR Duitku POP) ──
app.get('/petung/checkout/:slug', (c) => {
  const slug = c.req.param('slug')
  const solution = getSolution(slug)
  const cfg = getDuitkuConfig(c.env)
  const plan = c.req.query('plan') || ''
  if (!solution) {
    return c.redirect('/petung')
  }
  return c.render(
    <CheckoutPage
      solution={solution}
      planMode={plan}
      duitkuConfigured={!!cfg}
      duitkuJs={duitkuJsUrl(cfg?.env ?? 'sandbox')}
    />,
    { title: `Checkout ${solution.nama} · Pétung` }
  )
})

// Halaman return setelah pembayaran (Duitku redirect ke sini)
app.get('/petung/pembayaran/return', (c) => {
  const merchantOrderId = c.req.query('merchantOrderId') || ''
  const reference = c.req.query('reference') || ''
  const resultCode = c.req.query('resultCode') || ''
  return c.render(
    <PaymentReturnPage
      merchantOrderId={merchantOrderId}
      reference={reference}
      resultCode={resultCode}
    />,
    { title: 'Status Pembayaran · Pétung' }
  )
})

// Detail SKU (slug dinamis — paling akhir)
app.get('/petung/:slug', (c) => {
  const slug = c.req.param('slug')
  const solution = getSolution(slug)
  if (!solution) {
    return c.render(
      <div style="text-align:center;padding:5rem 1rem">
        <h1>Solusi tidak ditemukan</h1>
        <p><a href="/petung" class="btn btn-primary">← Kembali ke katalog</a></p>
      </div>,
      { title: 'Tidak ditemukan · Pétung' }
    )
  }
  return c.render(<PetungDetail solution={solution} />, { title: `${solution.nama} · Pétung` })
})

// ════════════════════════════════════════════════════════════════════════
// API — mesin-pétung deterministik (no secret, no API luar)
// Semua output menyertakan disclaimer + sumber (Truth-Lock B9-04).
// ════════════════════════════════════════════════════════════════════════
app.use('/api/*', cors())

// GET /api/weton?tgl=yyyy-mm-dd
app.get('/api/weton', (c) => {
  try {
    const tgl = c.req.query('tgl') ?? ''
    const w = getWeton(parseTanggal(tgl))
    return c.json({ ok: true, weton: w, watak: watakWeton(w) })
  } catch (e: any) {
    return c.json({ ok: false, error: e.message ?? 'Input tidak valid' }, 400)
  }
})

// GET /api/jodoh?a=yyyy-mm-dd&b=yyyy-mm-dd
app.get('/api/jodoh', (c) => {
  try {
    const a = getWeton(parseTanggal(c.req.query('a') ?? ''))
    const b = getWeton(parseTanggal(c.req.query('b') ?? ''))
    const hasil = cekKecocokan(a, b)
    return c.json({ ok: true, wetonA: a, wetonB: b, hasil })
  } catch (e: any) {
    return c.json({ ok: false, error: e.message ?? 'Input tidak valid' }, 400)
  }
})

// GET /api/hari-baik?tgl=...&mulai=...&selesai=...&jumlah=5
app.get('/api/hari-baik', (c) => {
  try {
    const weton = getWeton(parseTanggal(c.req.query('tgl') ?? ''))
    const mulai = parseTanggal(c.req.query('mulai') ?? '')
    const selesai = parseTanggal(c.req.query('selesai') ?? '')
    const jumlah = Math.min(Math.max(Number(c.req.query('jumlah') ?? 5), 1), 15)
    const hasil = cariHariBaik({ weton, rentang: [mulai, selesai], jumlah })
    return c.json({ ok: true, weton, ...hasil })
  } catch (e: any) {
    return c.json({ ok: false, error: e.message ?? 'Input tidak valid' }, 400)
  }
})

// GET /api/nama-usaha?tgl=...&kata=Kopi
app.get('/api/nama-usaha', (c) => {
  try {
    const weton = getWeton(parseTanggal(c.req.query('tgl') ?? ''))
    const kata = c.req.query('kata') ?? 'Usaha'
    const hasil = usulNamaUsaha(weton, kata)
    return c.json({ ok: true, weton, ...hasil })
  } catch (e: any) {
    return c.json({ ok: false, error: e.message ?? 'Input tidak valid' }, 400)
  }
})

// ────────────────────────────────────────────────────────────────────────
// POST /api/intake — simpan lead ke D1 (B9-05 §4 · B9-04 §6 PDP: minimal)
// ────────────────────────────────────────────────────────────────────────
app.post('/api/intake', async (c) => {
  try {
    const body = await c.req.json()
    if (!body?.nama || !body?.kontak) {
      return c.json({ ok: false, error: 'Nama & kontak wajib diisi' }, 400)
    }
    const nama = String(body.nama).slice(0, 120)
    const kontak = String(body.kontak).slice(0, 160)
    const hajat = String(body.hajat ?? 'lain').slice(0, 40)
    const catatan = String(body.catatan ?? '').slice(0, 1000)

    if (c.env.DB) {
      const r = await c.env.DB.prepare(
        `INSERT INTO leads (nama, kontak, hajat, catatan, sumber, status) VALUES (?, ?, ?, ?, 'web', 'baru')`
      )
        .bind(nama, kontak, hajat, catatan)
        .run()
      return c.json({
        ok: true,
        id: r.meta?.last_row_id ?? null,
        message:
          'Terima kasih! Permintaanmu tersimpan. Tim kami akan menghubungi untuk menyusun outcome & harga final.',
      })
    }

    // Fallback bila DB belum terikat (mis. preview tanpa --local)
    return c.json({
      ok: true,
      message:
        'Terima kasih! Permintaanmu tercatat. (Catatan: penyimpanan permanen aktif saat D1 terhubung.)',
    })
  } catch {
    return c.json({ ok: false, error: 'Format tidak valid' }, 400)
  }
})

// ────────────────────────────────────────────────────────────────────────
// POST /api/checkout — buat invoice Duitku → kembalikan reference utk POP JS
// SSOT: B9-05 F2 PAY · secret hanya di server (B9-04 §6)
// ────────────────────────────────────────────────────────────────────────
app.post('/api/checkout', async (c) => {
  try {
    const cfg = getDuitkuConfig(c.env)
    if (!cfg) {
      return c.json(
        {
          ok: false,
          error:
            'Pembayaran belum dikonfigurasi (secret Duitku belum di-set). Set DUITKU_MERCHANT_CODE & DUITKU_API_KEY.',
        },
        503
      )
    }

    const body = await c.req.json()
    const slug = String(body?.slug ?? '')
    const planMode = String(body?.plan ?? '')
    const amount = Math.floor(Number(body?.amount))
    const nama = String(body?.nama ?? '').slice(0, 120)
    const email = String(body?.email ?? '').slice(0, 160)
    const phone = String(body?.phone ?? '').slice(0, 40)

    const solution = getSolution(slug)
    if (!solution) return c.json({ ok: false, error: 'SKU tidak ditemukan' }, 400)
    if (!nama || !email) return c.json({ ok: false, error: 'Nama & email wajib diisi' }, 400)
    if (!Number.isFinite(amount) || amount < 10000) {
      return c.json({ ok: false, error: 'Nominal tidak valid (min Rp 10.000)' }, 400)
    }

    const merchantOrderId = genMerchantOrderId(slug)
    const url = new URL(c.req.url)
    const origin = `${url.protocol}//${url.host}`
    const callbackUrl = `${origin}/api/payment/callback`
    const returnUrl = `${origin}/petung/pembayaran/return`

    const invoice = await createInvoice(cfg, {
      paymentAmount: amount,
      merchantOrderId,
      productDetails: `${solution.nama}${planMode ? ' · ' + planMode : ''} — Pétung`,
      email,
      customerVaName: nama,
      phoneNumber: phone,
      callbackUrl,
      returnUrl,
      expiryPeriod: 60,
      itemDetails: [{ name: solution.nama, price: amount, quantity: 1 }],
      customerDetail: { firstName: nama, email, phoneNumber: phone },
    })

    // Simpan order (pending) ke D1
    if (c.env.DB) {
      await c.env.DB.prepare(
        `INSERT INTO orders (merchant_order_id, reference, sku_slug, sku_nama, plan_mode, amount, nama, email, phone, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`
      )
        .bind(
          merchantOrderId,
          invoice.reference,
          solution.slug,
          solution.nama,
          planMode,
          amount,
          nama,
          email,
          phone
        )
        .run()
    }

    return c.json({
      ok: true,
      reference: invoice.reference,
      paymentUrl: invoice.paymentUrl,
      merchantOrderId,
    })
  } catch (e: any) {
    return c.json({ ok: false, error: e?.message ?? 'Gagal membuat invoice' }, 500)
  }
})

// ────────────────────────────────────────────────────────────────────────
// POST /api/payment/callback — notifikasi Duitku (x-www-form-urlencoded)
// Verifikasi signature → update status order di D1. (B9-05 F2 · B9-04 §6)
// ────────────────────────────────────────────────────────────────────────
app.post('/api/payment/callback', async (c) => {
  try {
    const cfg = getDuitkuConfig(c.env)
    if (!cfg) return c.text('Config missing', 503)

    const form = await c.req.parseBody()
    const merchantCode = String(form.merchantCode ?? '')
    const amount = String(form.amount ?? '')
    const merchantOrderId = String(form.merchantOrderId ?? '')
    const signature = String(form.signature ?? '')
    const resultCode = String(form.resultCode ?? '')
    const reference = String(form.reference ?? '')
    const paymentCode = String(form.paymentCode ?? '')

    if (!merchantCode || !amount || !merchantOrderId || !signature) {
      return c.text('Bad Parameter', 400)
    }

    const valid = await verifyCallbackSignature(cfg, {
      merchantCode,
      amount,
      merchantOrderId,
      signature,
    })
    if (!valid) return c.text('Bad Signature', 401)

    const status = resultCode === '00' ? 'paid' : 'failed'
    if (c.env.DB) {
      await c.env.DB.prepare(
        `UPDATE orders SET status = ?, result_code = ?, payment_code = ?, reference = COALESCE(?, reference),
         paid_at = CASE WHEN ? = 'paid' THEN CURRENT_TIMESTAMP ELSE paid_at END
         WHERE merchant_order_id = ?`
      )
        .bind(status, resultCode, paymentCode, reference, status, merchantOrderId)
        .run()
    }

    return c.text('OK', 200)
  } catch (e: any) {
    return c.text('Error: ' + (e?.message ?? 'unknown'), 500)
  }
})

// GET /api/order/:merchantOrderId — cek status order (untuk halaman return)
app.get('/api/order/:moid', async (c) => {
  const moid = c.req.param('moid')
  if (!c.env.DB) return c.json({ ok: false, error: 'DB tidak aktif' }, 503)
  const row = await c.env.DB.prepare(
    `SELECT merchant_order_id, sku_nama, amount, status, result_code, payment_code, created_at, paid_at FROM orders WHERE merchant_order_id = ?`
  )
    .bind(moid)
    .first()
  if (!row) return c.json({ ok: false, error: 'Order tidak ditemukan' }, 404)
  return c.json({ ok: true, order: row })
})

// ════════════════════════════════════════════════════════════════════════
// Artefak (Proof-of-Outcome) — HTML print-ready (window.print → PDF)
// Disclaimer kanonik WAJIB menempel (B9-04 §3 · B9-05 §5).
// ════════════════════════════════════════════════════════════════════════

// GET /artefak/kartu-weton?tgl=...&nama=...
app.get('/artefak/kartu-weton', (c) => {
  try {
    const tgl = c.req.query('tgl') ?? ''
    const nama = c.req.query('nama') ?? ''
    const w = getWeton(parseTanggal(tgl))
    const html = renderKartuWeton({ nama, weton: w, watak: watakWeton(w) })
    return c.html(html)
  } catch (e: any) {
    return c.html(`<p style="font-family:sans-serif;padding:2rem">Gagal membuat kartu: ${e?.message ?? 'input tidak valid'}. <a href="/petung/cek">Kembali</a></p>`, 400)
  }
})

// GET /artefak/kalender?tgl=...&mulai=...&selesai=...&nama=...&judul=...&jumlah=...
app.get('/artefak/kalender', (c) => {
  try {
    const w = getWeton(parseTanggal(c.req.query('tgl') ?? ''))
    const mulai = parseTanggal(c.req.query('mulai') ?? '')
    const selesai = parseTanggal(c.req.query('selesai') ?? '')
    const jumlah = Math.min(Math.max(Number(c.req.query('jumlah') ?? 7), 1), 15)
    const nama = c.req.query('nama') ?? ''
    const judul = c.req.query('judul') ?? 'Kalender Hari Baik'
    const hasil = cariHariBaik({ weton: w, rentang: [mulai, selesai], jumlah })
    const html = renderKalenderHariBaik({ nama, judul, weton: w, kandidat: hasil.kandidat })
    return c.html(html)
  } catch (e: any) {
    return c.html(`<p style="font-family:sans-serif;padding:2rem">Gagal membuat kalender: ${e?.message ?? 'input tidak valid'}. <a href="/petung/hari-baik">Kembali</a></p>`, 400)
  }
})

export default app
