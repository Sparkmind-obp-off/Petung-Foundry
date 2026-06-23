// ════════════════════════════════════════════════════════════════════════
// index.tsx — Pétung Foundry · entry point (Hono + Cloudflare Pages)
// SSOT: B9-05 (blueprint webapp) · routes /petung + tools + API deterministik
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
import { getSolution } from './data/solutions'

import {
  getWeton,
  watakWeton,
  cekKecocokan,
  cariHariBaik,
  usulNamaUsaha,
  parseTanggal,
} from './lib/petung'

const app = new Hono()

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

// POST /api/intake — demo (tidak menyimpan permanen di v1)
app.post('/api/intake', async (c) => {
  try {
    const body = await c.req.json()
    if (!body?.nama || !body?.kontak) {
      return c.json({ ok: false, error: 'Nama & kontak wajib diisi' }, 400)
    }
    return c.json({
      ok: true,
      message:
        'Terima kasih! Permintaanmu tercatat (demo). Tim kami akan menghubungi untuk menyusun outcome & harga final.',
    })
  } catch {
    return c.json({ ok: false, error: 'Format tidak valid' }, 400)
  }
})

export default app
