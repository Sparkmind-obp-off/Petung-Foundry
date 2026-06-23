# B9-06 · CROSS-BRAND-MAP-DOC — Posisi Pétung di Ekosistem SparkMind ⭐ BARU v2.0
## SparkMind · SSOT Batch 9 · Cross-brand integration (pola BarberKas Cross-Brand Map)

> **v2.0** · 2026-06-23 · Fokus: peta Pétung di ekosistem SparkMind Sovereign, shared infra,
> cross-sell, relasi dengan BarberKas / MomentKas / Nurani.OS, dan disiplin "1 mesin → banyak brand".
> **Status:** CANONICAL · PUBLIC-SAFE. Diturunkan dari `11-BARBERKAS-AaaS-CROSS-BRAND-MAP`.

═══════════════════════════════════════════════════════════════
🔒 HARD CONSTRAINTS embedded (lihat B9-00)
═══════════════════════════════════════════════════════════════

---

## 1. SparkMind Sovereign Ecosystem Topology (Pétung disisipkan)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                  SPARKMIND SOVEREIGN ECOSYSTEM                            │
│                  Doctrine: MASTER-ARCHITECT-PROMPT v5.0 + v7.0 + v8.0     │
│                  Founder: Reza Estes / Haidar Faras (Gyss)                │
│                  Root: sparkmind.web.id · Outcome Foundry (Batch 5)       │
└─────────────────────────────────────────────────────────────────────────┘
        │                     │                     │                  │
┌───────────────┐  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐
│  GOVERNANCE   │  │  IDENTITY         │  │  REVENUE (vertikal)│  │  RESEARCH    │
│ - Doctrine    │  │ - SparkMind core  │  │ - BarberKas (P0)   │  │ - SSOT B1–B9 │
│ - Decision log│  │ - Oasis BI Pro    │  │ - KuratorKas (P1)  │  │ - Bundles    │
│ - Audit       │  │   MoR Duitku      │  │ - PaceLokal (P1)   │  │ - DR Addenda │
│               │  │                   │  │ - PÉTUNG (B9) ⭐    │  │              │
│               │  │                   │  │ - Nurani.OS (P2)   │  │              │
└───────────────┘  └──────────────────┘  └──────────────────┘  └──────────────┘
```

---

## 2. Brand Portfolio Status (update dengan Pétung)

| Brand | Niche | Status | Tier | Notes |
|---|---|---|---|---|
| **SparkMind** | Parent / Outcome Foundry | LIVE | Root | sparkmind.web.id |
| **Oasis BI Pro** | MoR / payment infra | LIVE | Operational | Duitku merchant aktif |
| **BarberKas** | Barbershop UMKM POS+AaaS | EXECUTE P0 | Revenue #1 | v8.0 sprint → v2 AaaS |
| **KuratorKas** | Fashion UMKM AaaS | LANDING | P1 | Landing only |
| **PaceLokal** | Running/klub hyperlocal | PARK/FREEZE | P1 | Bundle ready |
| **PÉTUNG** ⭐ | **Mistik Jawa × OaaS** | **SSOT READY (B9 v2.0)** | **Revenue vertikal-7** | **Beachhead: pernikahan; eksekusi post-HITL** |
| **Nurani.OS** | Spiritual OS (future) | PARK/FREEZE | P2 | Concept stage — *lihat §5 relasi dgn Pétung* |

> **Pétung naik dari "konsep" → "SSOT READY"** dengan bundle 8-doc lengkap (setara kelengkapan
> bundle BarberKas). Siap masuk antrian eksekusi setelah HITL owner.

---

## 3. Shared Infrastructure (Cross-Brand Leverage — Pétung reuse total)

| Component | Dipakai Pétung? | Cara reuse |
|---|---|---|
| **Cloudflare account** | ✅ | Single Workers Paid covers all brands |
| **Cloudflare D1** | ✅ | Tabel `leads`/`orders` existing (hindari schema baru — R6-4) |
| **Cloudflare R2** | ✅ | Single bucket, prefix `petung/` untuk artefak (PDF/kartu) |
| **Cloudflare KV** | ✅ (opsional) | Cache tabel neptu / config |
| **Duitku via Oasis BI Pro** | ✅ | Sub-merchant `petung`, brand_ledger tercatat (pola semua brand) |
| **Engine checkout/MoR** | ✅ | Reuse penuh (one-time → otomatis; DFY → intake+invoice) |
| **GitHub org** | ✅ | Repo `Petung-Foundry` (repo ini) |
| **Genspark AI Dev** | ✅ | Single environment, build & deploy edge |
| **36 sovereign skill** | ✅ | `fullstack-cycle`, `orchestrator`, squads + `mesin-pétung` baru |

> **Insight (pola BarberKas §3):** karena infra 100% shared & COGS edge ~0, **menambah brand
> baru ≈ biaya marginal ~nol**. Inilah kekuatan "horizontal-play" — 1 mesin, banyak vertikal.

---

## 4. Cross-sell map (Pétung memberi makan vertikal lain) ⭐

```
                   ┌──────────────────────────────┐
                   │   PÉTUNG (entry budaya/hajat) │
                   └──────────────────────────────┘
                        │            │           │
        Pétung Usaha ───┘     Pétung Pengantin   Kartu Weton (viral)
            │                        │                  │
            ▼                        ▼                  ▼
   ┌─────────────────┐      ┌─────────────────┐   top-of-funnel
   │ BarberKas /     │      │ MomentKas        │   → semua SKU
   │ Toko Online     │      │ (undangan/RSVP)  │
   │ (UMKM buka usaha│      │ (pengantin butuh │
   │  = lead panas)  │      │  undangan live)  │
   └─────────────────┘      └─────────────────┘
```

| Dari Pétung | Ke brand SparkMind | Pemicu cross-sell |
|---|---|---|
| Pétung Usaha | **BarberKas / Toko Online / KuratorKas** | UMKM yang cari "hari baik buka usaha" → butuh sistem usaha (POS/toko). |
| Pétung Pengantin | **MomentKas** | Pengantin → butuh undangan digital + RSVP + tiket. |
| Kartu Weton (viral) | **semua** | Top-of-funnel organik (shareable) → awareness ekosistem. |
| Pétung Partner | **MoR-aaS / Oasis BI Pro** | Partner WO pakai rel bayar kita. |

> **Two-way:** sebaliknya, pelanggan BarberKas/MomentKas yang Jawa = lead untuk Pétung
> (mis. barbershop owner mau buka cabang di hari baik). **Ekosistem saling menyuburkan.**

---

## 5. Relasi dengan Nurani.OS (klarifikasi penting — anti-tabrakan)

> Nurani.OS = "Spiritual OS (future)" sudah ada di portfolio (PARK/FREEZE, P2). Pétung juga
> menyentuh "spiritual". Agar tidak tumpang-tindih (lihat juga B9-02 §2.3):

| Dimensi | **Pétung** (B9 — eksekusi dulu) | **Nurani.OS** (payung — future) |
|---|---|---|
| Cakupan | Sempit & konkret: budaya **Jawa** | Luas: spiritual lintas-keyakinan |
| Objek | **Outcome/artefak** (hari baik, kartu, undangan) | OS/platform (belum terdefinisi) |
| Kesiapan | **SSOT READY**, beachhead jelas | Concept stage |
| Risiko etika | Terkelola (Jawa spesifik) | Lebih tinggi (lintas-keyakinan) |

> **Keputusan kanonik (rekomendasi, final = HITL):**
> 1. **Eksekusi Pétung lebih dulu** sebagai vertikal konkret (outcome jelas).
> 2. **Nurani.OS tetap payung jangka panjang.** Bila diaktifkan, **Pétung = modul/vertikal
>    pertama** di bawahnya (budaya Jawa = entry point "spiritual OS"). → **berlapis, bukan bersaing.**

---

## 6. Disiplin "1 mesin → banyak brand" (anti-fragmentasi)

| Aturan | Penjelasan |
|---|---|
| **Reuse > rebuild** | Setiap brand baru WAJIB reuse engine/MoR/data existing (R6-4). |
| **Skill bersama** | `fullstack-cycle`, `orchestrator`, squads dipakai semua; hanya tambah util kecil (mesin-pétung). |
| **Brand_ledger per-brand** | Pisahkan pencatatan revenue per sub-merchant untuk audit. |
| **Doctrine tunggal** | Semua brand tunduk D-1 Truth-Lock + HITL gate. |
| **Jangan duplikasi infra** | 1 CF account, 1 Duitku merchant, prefix/sub-merchant per brand. |

---

## 7. Definition of Done (cross-brand map)

- [x] Topology ekosistem + Pétung disisipkan sebagai vertikal-7.
- [x] Portfolio status update (Pétung = SSOT READY).
- [x] Shared infra reuse map (Pétung reuse total).
- [x] Cross-sell map two-way (Pétung ↔ BarberKas/MomentKas/Toko Online).
- [x] Relasi Nurani.OS diklarifikasi (berlapis, anti-tabrakan).
- [ ] **HITL owner:** konfirmasi urutan eksekusi vertikal (Pétung vs antrian lain).

---

*Truth-Lock: dokumen peta cross-brand. Atribusi pola: `11-BARBERKAS-AaaS-CROSS-BRAND-MAP`.
Pétung reuse infra & MoR SparkMind sepenuhnya — tidak menambah stack/akun baru.*
