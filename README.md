# Pétung Foundry — Outcome Foundry Budaya Jawa (OaaS)

> **Pétung** = sub-brand vertikal SparkMind di niche **Mistik/Budaya Jawa × Outcome Foundry (OaaS)**.
> Bukan jual ramalan — jual **outcome budaya yang rapi & dipersonalisasi** (kalender hari baik,
> kartu weton, nama usaha selaras weton) dengan disiplin **Truth-Lock** (edukasi-budaya, bukan klaim gaib).

**Status**: ✅ Webapp v2.0 LIVE di Cloudflare Pages (P2–P4 roadmap B9-05: tools + checkout MoR + artefak + D1) · **Doctrine**: D-1 Truth-Lock (MAXIMUM BRUTAL HONEST)
**Eksekusi dari**: SSOT Batch 9 v2.0 (`PETUNG-FOUNDRY-SSOT-BUNDLE-v2.0`)

**Production URL**: https://petung-foundry.pages.dev
**Pembayaran**: Duitku **PRODUCTION** (MoR, merchant `D20919`) — terverifikasi LIVE (`reference` & `app-prod.duitku.com` checkout aktif). Secret di Cloudflare Pages (`DUITKU_MERCHANT_CODE`/`DUITKU_API_KEY`/`DUITKU_ENV`), bukan di repo.
**Database**: Cloudflare D1 `petung-foundry-production` (`3eb5c42e-…`) — migrations + seed ter-apply (remote), tabel `leads` + `orders`.

---

## Project Overview
- **Nama**: Pétung (by SparkMind Outcome Foundry)
- **Goal**: Mengubah weton & primbon Jawa menjadi **artefak budaya yang rapi, dipersonalisasi, & langsung pakai** — dijual sebagai paket hibrida (DIY/DWY/DFY) dengan harga IDR.
- **Niche**: Spiritual-budaya Jawa (weton, primbon, neptu, hari baik) — UMKM/individu Indonesia.
- **Posisi**: Vertikal ke-7 SparkMind, mesin sama dengan BarberKas/Toko Online/MomentKas — kemasan & niche beda.

## Fitur yang Sudah Selesai (v1)
- ✅ **Landing outcome** (`/`) — hero, widget cek weton cepat, katalog SKU, cara kerja, etika/Truth-Lock.
- ✅ **Katalog solusi** (`/petung`) — 9 SKU dikelompokkan dalam 6 revenue stream (S1–S6).
- ✅ **Detail SKU** (`/petung/:slug`) — promise, masalah, outcomes, tangga harga (DIY/DWY/DFY), value-metric.
- ✅ **Mesin-pétung deterministik** (`src/lib/petung.ts`) — `getWeton`, `cekKecocokan`, `cariHariBaik`, `usulNamaUsaha`. 100% deterministik, no API luar, auditable (6 unit test PASS).
- ✅ **4 tool gratis interaktif**: cek weton, cek kecocokan (jodoh), cari hari baik, usul nama usaha.
- ✅ **Komponen Disclaimer wajib** (Truth-Lock B9-04) — tampil di footer, hasil tool, & setiap output API.
- ✅ **Halaman intake/konsultasi** (`/petung/intake`) — tersimpan ke **D1** (`leads`).
- ✅ Desain "premium budaya Jawa" (palet sogan/emas/hijau/krem — B9-02 §6), responsif.

## Fitur Baru v2.0
- ✅ **Checkout MoR Duitku POP** (`/petung/checkout/:slug`) — invoice dibuat server-side (`POST /api/checkout`), pembayaran via Duitku POP (QRIS/VA). Secret HANYA di server (B9-04 §6).
- ✅ **Callback pembayaran ter-verifikasi signature** (`POST /api/payment/callback`, HMAC SHA256 Web Crypto) → update status `orders` di D1.
- ✅ **Halaman status pembayaran** (`/petung/pembayaran/return`) + `GET /api/order/:moid`.
- ✅ **Artefak Proof-of-Outcome print-ready (PDF via window.print)**: `/artefak/kartu-weton`, `/artefak/kalender` — disclaimer kanonik menempel.
- ✅ **Persistensi D1** (`migrations/0001`): tabel `leads` + `orders`, PDP-minimal (B9-04 §6).
- ✅ **12 unit test PASS** mesin-pétung (`npm test`).

### 💳 Status Pembayaran (Duitku MoR — terverifikasi PRODUCTION)
- ✅ **Integrasi Duitku POP terverifikasi LIVE** terhadap endpoint **production** (`api-prod.duitku.com`).
  Merchant `D20919` → `createInvoice` mengembalikan `HTTP 200 SUCCESS` + `reference` + `paymentUrl` nyata.
- ✅ **Lifecycle penuh teruji**: checkout → invoice → order `pending` di D1 → callback (signature terverifikasi)
  → order `paid`. Callback dengan signature salah ditolak `401 Bad Signature`.
- ⚙️ **ENV**: `DUITKU_ENV=production`. Kredensial disimpan di `.dev.vars` (lokal, **di-`.gitignore`**) dan
  sebagai **Cloudflare Pages secrets** untuk produksi:
  ```bash
  npx wrangler pages secret put DUITKU_MERCHANT_CODE --project-name petung-foundry
  npx wrangler pages secret put DUITKU_API_KEY --project-name petung-foundry
  npx wrangler pages secret put DUITKU_ENV --project-name petung-foundry   # isi: production
  ```
- ⚠️ **Truth-Lock harga**: nominal masih **draft/HITL** — checkout pakai input nominal manual sampai
  owner finalisasi harga + legal + copy (gate wajib niche sensitif, B9-03/B9-04).

## URI Fungsional (paths & parameter)

### Halaman
| Path | Deskripsi |
|---|---|
| `/` | Landing outcome |
| `/petung` | Katalog 9 SKU (6 stream) |
| `/petung/:slug` | Detail SKU (mis. `/petung/petung-pengantin`) |
| `/petung/cek` | Tool: Cek Weton & Watak |
| `/petung/jodoh` | Tool: Cek Kecocokan (Weton Jodoh) |
| `/petung/hari-baik` | Tool: Cari Hari Baik |
| `/petung/nama-usaha` | Tool: Usul Nama Usaha selaras weton |
| `/petung/intake` | Konsultasi / mulai pesanan |

### API (deterministik — output selalu menyertakan `sumber` + `disclaimer`)
| Endpoint | Parameter | Output |
|---|---|---|
| `GET /api/weton` | `tgl=yyyy-mm-dd` | weton (hari, pasaran, neptu) + watak |
| `GET /api/jodoh` | `a=yyyy-mm-dd&b=yyyy-mm-dd` | kecocokan (total neptu, nama tafsir, arti) |
| `GET /api/hari-baik` | `tgl=&mulai=&selesai=&jumlah=` | daftar tanggal baik dalam rentang |
| `GET /api/nama-usaha` | `tgl=&kata=` | 3–5 usulan nama selaras weton |
| `POST /api/intake` | JSON `{nama, hajat, kontak, catatan}` | konfirmasi (demo v1, tidak menyimpan permanen) |

## Data Architecture
- **Mesin perhitungan**: `src/lib/petung.ts` + `src/lib/petung-data.ts` (tabel neptu hari & pasaran, tafsir, atribusi sumber). Deterministik penuh, basis UTC, idempoten (no drift).
- **Katalog SKU**: `src/data/solutions.ts` — 9 SKU `petung-*`, 6 revenue stream (S1–S6), model tier DIY/DWY/DFY.
- **Storage**: v1 stateless (tools deterministik, COGS edge ~0). Versi produksi → reuse tabel `leads`/`orders` + checkout MoR (Duitku QRIS/VA) sesuai B9-05 §4.
- **Truth-Lock**: harga = `priceIdr: null` (DRAFT, menunggu HITL owner — pola R6-4). UI menampilkan "Harga menunggu konfirmasi".

## User Guide
1. Buka `/` → masukkan tanggal lahir di widget "Cek Weton Cepat", atau buka `/petung/cek`.
2. Lihat weton, neptu, & watak (versi primbon, edukasi-budaya).
3. Untuk hajat → `/petung/hari-baik` (cari tanggal baik). Untuk usaha → `/petung/nama-usaha`.
4. Untuk pasangan → `/petung/jodoh` (cek kecocokan weton).
5. Tertarik paket lengkap → buka detail SKU & klik "Konsultasi / Mulai".

## Etika & Truth-Lock (B9-04 — WAJIB)
- ✅ **BOLEH**: "Menurut primbon Jawa…", menampilkan sumber/metode, mengakui variasi antar aliran.
- ❌ **DILARANG**: "dijamin hoki/langgeng/sukses", menakut-nakuti ("kalau salah hari, sial"), klaim mencegah sial/menolak bala, klaim medis/finansial/hukum.
- Disclaimer kanonik tampil di footer, hasil tool, & setiap output API.
- ⚠️ **Catatan**: Pricing final, copy customer-facing, & klaim = **gate HITL owner** (legal + customer-facing) sebelum produksi live.

## Tech Stack & Deployment
- **Framework**: Hono + JSX (SSR)
- **Build**: Vite (`@hono/vite-cloudflare-pages`)
- **Platform**: Cloudflare Pages/Workers (edge-native, COGS ~0)
- **Bahasa**: Indonesia-first
- **Status**: ✅ Active (sandbox dev). Deploy produksi = setelah HITL owner.
- **Last Updated**: 2026-06-23

### Perintah
```bash
npm install
npm run build          # build → dist/
npm test               # unit test mesin-pétung (node --test)
pm2 start ecosystem.config.cjs   # jalankan dev server (port 3000)
```

## Fitur Belum Diimplementasi (roadmap B9-05 §6)
- ⏳ **P1 (HITL owner)**: finalisasi nama, pricing, legal, copy.
- ⏳ **P4**: Checkout SKU (reuse engine MoR/Duitku) + artefak PDF/kartu yang dapat diunduh.
- ⏳ **P5**: Cross-sell ke Toko Online/MomentKas + Pétung Partner (white-label).
- ⏳ Render artefak PDF kalender hari baik & kartu weton (saat ini hasil tampil di layar).
- ⏳ Persistensi data intake (D1) + reminder Kaléndér Pétung (MRR).

## Recommended Next Steps
1. **HITL owner** review pricing + legal + copy customer-facing (gate wajib niche sensitif).
2. Tambah render PDF artefak (kalender/kartu) + tombol unduh.
3. Integrasi checkout MoR (Duitku QRIS/VA) untuk SKU berbayar.
4. Tambah persistensi intake/leads (Cloudflare D1).
5. Deploy ke Cloudflare Pages produksi (`petung-foundry`).

## SSOT (Single Source of Truth)
Dokumen kanonik Batch 9 ada di [`docs/ssot/batch-9/`](docs/ssot/batch-9/):
B9-00 (Index) · B9-01 (Riset Pasar) · B9-02 (Konsep Brand) · B9-03 (Monetization) ·
B9-04 (Truth-Lock & Etika) · B9-05 (Delivery & Webapp-Map) · B9-06 (Cross-Brand) · B9-07 (Secret-Doctrine & Moat).

---

*Repo kanonik: https://github.com/Sparkmind-obp-off/Petung-Foundry · by SparkMind Outcome Foundry.
Truth-Lock: webapp ini menjual artefak budaya sebagai edukasi-budaya, bukan kepastian/ramalan.*
