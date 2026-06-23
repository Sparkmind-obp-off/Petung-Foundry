# B9-05 · DELIVERY-WEBAPP-MAP-DOC — Cara Deliver, Mesin→Outcome, Blueprint Webapp
## SparkMind · SSOT Batch 9 · Pétung — eksekusi (peta + roadmap) — **v2.0**

> **v2.0** · 2026-06-23 · Fokus: bagaimana outcome di-deliver, peta 36 skill → SKU Pétung,
> blueprint webapp (route + mesin-pétung + data), **spec mesin-pétung deterministik detail**, dan
> roadmap eksekusi credit-aware. Diturunkan dari B5-04 (delivery engine) + B4-05 (migration map)
> + pola Architect/Sprint BarberKas. **Status: cetak biru.**
> **Upgrade v2.0:** + tabel neptu lengkap (hari & pasaran), + pseudo-algoritma hari baik, +
> kontrak fungsi `mesin-pétung`, + rencana unit-test, + struktur file webapp konkret, + KPI bernominal.

═══════════════════════════════════════════════════════════════
🔒 HARD CONSTRAINTS embedded (lihat B9-00)
═══════════════════════════════════════════════════════════════

---

## 1. Pipeline delivery (warisan B5-04, disesuaikan)

```
F0 INTAKE     Pengunjung pakai tool gratis "cek weton" / isi /api/intake (hajat, tanggal lahir).
   │          Gate: klasifikasi SKU (Pengantin/Usaha/Kartu) + Truth-Lock (framing budaya).
F1 SCOPE      Tentukan DoO + plan (DIY/Setup/DFY) + harga. HITL bila DFY/high-ticket.
F2 PAY        Checkout MoR (Duitku QRIS/VA). brand_ledger tercatat. (DFY → invoice.)
F3 ASSEMBLE   Mesin-pétung (deterministik) hitung neptu/hari baik → fullstack-cycle rakit artefak
   │          (PDF kalender / kartu / halaman undangan / usulan nama). credit-aware.
F4 DEPLOY     Halaman/artefak live di Cloudflare Pages (sub-path / akun klien).
   │          Gate: verify-rubric + cek disclaimer budaya tampil (B9-04).
F5 PROOF      Kirim bukti: URL live + file artefak + faktur. DoO ter-centang → "selesai".
F6 ONBOARD    (langganan) handoff Kaléndér Pétung / Care Plan halaman.
F7 RETAIN     Reminder hari baik tahunan / maintenance halaman.
```

> F0–F5 = land (artefak deterministik). F6–F7 = retain (langganan, MRR).

---

## 2. Peta mesin → outcome (36 skill → SKU Pétung)

| SKU Pétung (Lapis 1) | Mesin skill utama (Lapis 2) |
|---|---|
| **Pétung Pengantin** | `fullstack-cycle`, `cf-byok-deploy`, `squad-product`, `mesin-pétung`* |
| **Pétung Usaha** | `fullstack-cycle`, `squad-marketing` (nama), `gtm-engineering`, `mesin-pétung`* |
| **Kartu Weton** | `content-generation`/`cmo`, `fullstack-cycle` (render), `mesin-pétung`* |
| **Kaléndér Pétung** | `workflow-ops` (reminder), `hermes-memory`, `mesin-pétung`* |
| **Paket Hajat Lengkap (DFY)** | `orchestrator` + C-Suite + squads + `MomentKas` (RSVP/undangan) |
| **Pétung Partner (white-label)** | engine checkout, MoR, `zero-trust`, `legal` |

> *`mesin-pétung` = **fungsi deterministik baru** (bukan API luar): hari+pasaran→neptu→hari baik.
> Ditulis sebagai util murni di edge (no secret, no drift) → bisa jadi skill `sovereign-petung`
> mengikuti SKILL-AUTHORING-STANDARD (frontmatter `outcome`, `cloudflare-native: true`,
> `hitl-gate: customer-facing`, `drift-prone: false`).

---

## 3. Spec mesin-pétung (logika deterministik — inti yang aman) ⭐ enhanced v2.0

### 3.1 Tabel referensi neptu (sumber: primbon Jawa umum — atribusi & catatan variasi)

**Neptu Hari (Saptawara):**
| Hari | Neptu |
|---|---|
| Minggu (Ahad) | 5 |
| Senin | 4 |
| Selasa | 3 |
| Rabu | 7 |
| Kamis | 8 |
| Jumat | 6 |
| Sabtu | 9 |

**Neptu Pasaran (Pancawara):**
| Pasaran | Neptu |
|---|---|
| Legi | 5 |
| Pahing | 9 |
| Pon | 7 |
| Wage | 4 |
| Kliwon | 8 |

> ⚠️ **Catatan variasi (Truth-Lock B9-04 §1):** ada perbedaan kecil antar daerah/aliran primbon
> pada beberapa tafsir. Sumber/metode **wajib ditampilkan** ke pengguna; tidak ada klaim
> "satu-satunya benar". Tabel neptu hari & pasaran di atas adalah versi yang paling umum/standar.

### 3.2 Algoritma (pseudo) — deterministik & dapat diaudit

```
Input  : tanggal masehi (lahir / kandidat hajat), referensi epoch pasaran diketahui.
Step 1 : tanggal → hari (Senin..Minggu) via kalender Gregorian (deterministik).
Step 2 : tanggal → pasaran (Legi..Kliwon) via modulo-5 dari epoch pasaran acuan (deterministik).
Step 3 : neptu = neptu_hari + neptu_pasaran.
Step 4 : (jodoh) neptu_A + neptu_B → tafsir menurut tabel primbon (mis. sisa bagi tertentu).
Step 5 : (hari baik) iterasi tanggal kandidat dalam rentang → filter sesuai kriteria neptu
         metode primbon → urutkan → ambil N terbaik.
Output : artefak (kalender/kartu/panduan) + DISCLAIMER budaya (B9-04) wajib menempel.
```

### 3.3 Kontrak fungsi (rencana `src/lib/petung.ts`)

```ts
// 100% deterministik, no I/O, no API luar, no secret → aman & auditable.
type Pasaran = 'Legi'|'Pahing'|'Pon'|'Wage'|'Kliwon';
type Weton = { hari: string; pasaran: Pasaran; neptuHari: number; neptuPasaran: number; neptu: number };

getWeton(date: Date): Weton;                       // tanggal → weton + neptu
cekKecocokan(a: Weton, b: Weton): { total:number; tafsir:string; sumber:string }; // jodoh (edukasi)
cariHariBaik(opts:{ weton:Weton; rentang:[Date,Date]; metode:string }): Date[];   // hari baik
// Setiap output WAJIB menyertakan { disclaimer, sumberMetode } (Truth-Lock).
```

- **100% deterministik & dapat diaudit** → memenuhi Truth-Lock teknis (B9-04 §7).
- **Tidak butuh AI runtime untuk hitung** (AI hanya bantu narasi/render artefak) → hemat credit.
- **Edge-native** (Cloudflare) → COGS ~0.

### 3.4 Rencana unit-test (deterministik = mudah diuji) ⭐ BARU v2.0

| Test | Input | Expected |
|---|---|---|
| Weton tanggal patok | tanggal lahir terkenal/terverifikasi | hari+pasaran+neptu sesuai primbon |
| Idempotensi | sama tanggal dipanggil 2× | output identik (no drift) |
| Rentang pasaran | 5 tanggal berurutan | siklus Legi→Pahing→Pon→Wage→Kliwon benar |
| Disclaimer menempel | semua output | field `disclaimer` non-empty |
| Tahun kabisat / pergantian abad | 29 Feb, 2000, 2100 | hari benar (kalender Gregorian) |

> Tabel neptu & tafsir = **data referensi** (disimpan sebagai `references/` mengikuti skill
> standard) dengan **atribusi sumber primbon** & catatan variasi (B9-04 §1).

---

## 4. Blueprint webapp (reuse stack SparkMind — tanpa ubah arsitektur)

| Item | Rencana | Reuse? |
|---|---|---|
| Route `/petung` | Landing outcome (hero + tool gratis + SKU + disclaimer) | route baru |
| Route `/petung/:slug` | Detail SKU + harga + CTA intake/checkout | route baru |
| Tool `/petung/cek` | Tool gratis "cek weton" (lead magnet) → CTA paket | komponen baru |
| `src/data/solutions.ts` | Tambah SKU `petung-*` (tier existing) | reuse model |
| Mesin-pétung | Util deterministik (`src/lib/petung.ts`) + tabel referensi | baru, kecil |
| Checkout | Engine MoR/Duitku existing | reuse penuh |
| Data | Tabel `leads`/`orders` existing (hindari schema baru) | reuse (pola R6-4) |
| Disclaimer | Komponen wajib (B9-04 §3) di hasil + footer + checkout | baru, kecil |

**Struktur file konkret (rencana, selaras stack Hono+Vite+CF Pages):**
```
src/
 ├─ lib/petung.ts            ← mesin deterministik (getWeton/cekKecocokan/cariHariBaik)
 ├─ lib/petung-data.ts       ← tabel neptu + tafsir + atribusi sumber
 ├─ data/solutions.ts        ← + SKU petung-* (reuse model existing)
 ├─ views/petung.tsx         ← PetungHome, PetungDetail, CekWetonTool
 └─ components/Disclaimer.tsx ← komponen disclaimer wajib (B9-04)
```

> **Perubahan minimal-invasif** (tambah, jangan hancurkan) — identik prinsip B4-05 §1 & BarberKas.

---

## 5. Proof-of-Outcome (bukti = produk, warisan B5-04 §3)

1. **URL live** halaman undangan/profil/kalender.
2. **File artefak** (PDF kalender hari baik / kartu weton) terunduh.
3. **Disclaimer budaya** tampil pada artefak (bukti kepatuhan B9-04).
4. **Faktur + disclosure MoR** via email.
5. (Galeri publik) contoh artefak (izin pelanggan) → trust + GTM.

---

## 6. Roadmap eksekusi (credit-aware — SETELAH HITL)

| Sprint | Aktivitas | Gate |
|---|---|---|
| **P0 (sekarang)** | SSOT B9 v2.0 (8 doc) selesai & di-commit + push GitHub | aman (dokumen) |
| **P1** | HITL owner: nama final + pricing + legal + copy | **HITL wajib** |
| **P2** | Mesin-pétung util + tabel referensi + unit test (deterministik) | review kode |
| **P3** | Landing `/petung` + tool gratis cek weton + 1 SKU beachhead (Pétung Pengantin) | build hijau |
| **P4** | Checkout SKU (reuse MoR) + disclaimer + artefak PDF/kartu | verify-rubric + legal |
| **P5** | Cross-sell ke Toko Online/MomentKas + 1 partner WO/EO (white-label) | GTM |

> Urutan = land beachhead dulu (Pétung Pengantin) → baru ekspansi (selaras B4-04 & Sprint BarberKas).

---

## 7. KPI menang (warisan B4-04 §9 + B3-01 METRIK-AAAS, bernominal) ⭐ enhanced v2.0

| KPI | Target awal | Catatan |
|---|---|---|
| Landing → lead (tool cek weton) | **> 3%** | top-of-funnel viral (Kartu Weton) |
| Lead → tripwire/paket | **> 8%** | konversi ke S1/S2 |
| AOV blended | **> Rp 150.000** | naik via paket > item satuan |
| MRR (Kaléndér/Care Plan) | mulai > Rp 0 → naik MoM | retensi = mesin tumbuh |
| Time-to-Outcome (TTO) | **< 24 jam** (DIY/DWY); hari (DFY) | diferensiator vs WO manual |
| Cross-sell ke vertikal SparkMind lain | **≥ 1 / 10** pembeli Pétung Usaha | feed BarberKas/Toko Online/MomentKas |
| Partner WO/EO aktif | **≥ 1 (D90)** | network effect |
| Refund-rate | **< 5%** | deliver guarantee deterministik |

---

## 8. Definition of Done (delivery & webapp-map v2.0)

- [x] Pipeline delivery + peta mesin→outcome.
- [x] **Spec mesin-pétung detail**: tabel neptu (hari+pasaran), algoritma, kontrak fungsi, unit-test.
- [x] Blueprint webapp reuse-stack + struktur file konkret (route, data, checkout, disclaimer).
- [x] Proof-of-outcome + roadmap P0–P5 + KPI bernominal.
- [ ] **HITL owner (P1):** approve → mulai eksekusi kode P2.

---

## 9. Ringkasan satu kalimat (kanonik)

> **Pétung di-deliver lewat pipeline Outcome Foundry yang sama (intake→pétung deterministik→
> rakit artefak→deploy edge→proof), reuse total stack & MoR SparkMind, dengan mesin perhitungan
> yang dapat diaudit (tabel neptu standar + unit-test) & disclaimer budaya wajib — eksekusi kode
> menunggu HITL owner.**

---

*Truth-Lock: cetak biru ini dokumen. Eksekusi kode = setelah HITL (pricing+legal+customer-facing).
Mesin-pétung deterministik (no drift, no API ramalan). Tabel neptu = primbon umum dengan catatan
variasi. Atribusi pola: B5-04, B4-05, R6-4, & Architect/Sprint BarberKas AaaS.*
