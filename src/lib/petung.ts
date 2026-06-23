// ════════════════════════════════════════════════════════════════════════
// petung.ts — Mesin-pétung deterministik (inti yang aman & auditable)
// SSOT: B9-05 §3 (spec) · B9-04 §7 (Truth-Lock teknis)
//
// 100% deterministik, no I/O, no API luar, no secret → aman & auditable.
// Sama input → sama output (idempoten, no drift). AI TIDAK dipakai untuk hitung;
// AI hanya bantu narasi/render artefak di lapisan lain. COGS edge ~0.
// ════════════════════════════════════════════════════════════════════════

import {
  NEPTU_HARI,
  NEPTU_PASARAN,
  SIKLUS_PASARAN,
  NAMA_HARI,
  WATAK_PASARAN,
  TAFSIR_JODOH_MOD8,
  SUMBER_METODE,
  DISCLAIMER_KANONIK,
  type Pasaran,
  type HariNama,
} from './petung-data'

export interface Weton {
  hari: HariNama
  pasaran: Pasaran
  neptuHari: number
  neptuPasaran: number
  neptu: number
  /** ISO date (yyyy-mm-dd, UTC) yang dihitung */
  tanggal: string
}

export interface HasilKecocokan {
  total: number
  nama: string
  tafsir: string
  sumber: string
  disclaimer: string
}

export interface HariBaik {
  tanggal: string
  hari: HariNama
  pasaran: Pasaran
  neptu: number
  alasan: string
}

export interface HasilCariHariBaik {
  kandidat: HariBaik[]
  sumber: string
  disclaimer: string
}

// ────────────────────────────────────────────────────────────────────────
// Util internal — deterministik penuh, basis UTC agar tidak terpengaruh TZ.
// ────────────────────────────────────────────────────────────────────────

// Epoch acuan pasaran: 1970-01-01 (Kamis) = 'Wage' (indeks 3 di SIKLUS_PASARAN).
// Sumber: konvensi primbon Jawa umum.
const EPOCH_PASARAN_INDEX = 3 // 'Wage'
const MS_PER_DAY = 24 * 60 * 60 * 1000

/** Normalisasi Date ke tengah-hari UTC agar bebas dari masalah TZ/DST. */
function toUtcDays(date: Date): number {
  const utc = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  )
  return Math.floor(utc / MS_PER_DAY)
}

/** Modulo yang selalu non-negatif. */
function mod(n: number, m: number): number {
  return ((n % m) + m) % m
}

function isoDate(date: Date): string {
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, '0')
  const d = String(date.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// ────────────────────────────────────────────────────────────────────────
// API publik (kontrak B9-05 §3.3)
// ────────────────────────────────────────────────────────────────────────

/**
 * getWeton — tanggal Masehi → weton (hari + pasaran) + neptu.
 * Deterministik: kalender Gregorian untuk hari, modulo-5 dari epoch untuk pasaran.
 */
export function getWeton(date: Date): Weton {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error('getWeton: tanggal tidak valid')
  }
  const hari = NAMA_HARI[date.getUTCDay()]
  const days = toUtcDays(date)
  const pasaranIdx = mod(EPOCH_PASARAN_INDEX + days, 5)
  const pasaran = SIKLUS_PASARAN[pasaranIdx]
  const neptuHari = NEPTU_HARI[hari]
  const neptuPasaran = NEPTU_PASARAN[pasaran]
  return {
    hari,
    pasaran,
    neptuHari,
    neptuPasaran,
    neptu: neptuHari + neptuPasaran,
    tanggal: isoDate(date),
  }
}

/** Watak ringkas (edukasi-budaya) berdasar pasaran weton. */
export function watakWeton(w: Weton): string {
  return WATAK_PASARAN[w.pasaran]
}

/**
 * cekKecocokan — kecocokan dua weton menurut metode neptu jodoh (jumlah mod 8).
 * Output = tafsir TRADISI + sumber + disclaimer (Truth-Lock B9-04).
 */
export function cekKecocokan(a: Weton, b: Weton): HasilKecocokan {
  const total = a.neptu + b.neptu
  const tafsir = TAFSIR_JODOH_MOD8[mod(total, 8)]
  return {
    total,
    nama: tafsir.nama,
    tafsir: tafsir.arti,
    sumber: SUMBER_METODE,
    disclaimer: DISCLAIMER_KANONIK,
  }
}

/**
 * cariHariBaik — cari N tanggal "baik" dalam rentang untuk pemilik weton.
 * Metode tradisi (dapat diaudit): pilih tanggal yang jumlah neptu-nya selaras
 * dengan weton pemilik hajat (jumlah total genap & cukup tinggi → dianggap baik
 * dalam tradisi), diurutkan dari neptu tertinggi. BUKAN ramalan pasti.
 */
export function cariHariBaik(opts: {
  weton: Weton
  rentang: [Date, Date]
  jumlah?: number
}): HasilCariHariBaik {
  const { weton, rentang } = opts
  const jumlah = opts.jumlah ?? 5
  const [mulai, selesai] = rentang
  if (mulai.getTime() > selesai.getTime()) {
    throw new Error('cariHariBaik: rentang tidak valid (mulai > selesai)')
  }

  const kandidat: HariBaik[] = []
  const cursor = new Date(
    Date.UTC(mulai.getUTCFullYear(), mulai.getUTCMonth(), mulai.getUTCDate())
  )
  const akhir = Date.UTC(
    selesai.getUTCFullYear(),
    selesai.getUTCMonth(),
    selesai.getUTCDate()
  )

  while (cursor.getTime() <= akhir) {
    const wHari = getWeton(cursor)
    const jumlahNeptu = weton.neptu + wHari.neptu
    // Kriteria tradisi (dapat diaudit): jumlah neptu genap dianggap "selaras",
    // dan neptu hari kandidat yang tinggi (>= 10) dianggap kuat.
    const selaras = jumlahNeptu % 2 === 0
    const kuat = wHari.neptu >= 10
    if (selaras && kuat) {
      kandidat.push({
        tanggal: wHari.tanggal,
        hari: wHari.hari,
        pasaran: wHari.pasaran,
        neptu: wHari.neptu,
        alasan: `Jumlah neptu Anda (${weton.neptu}) + hari ini (${wHari.neptu}) = ${jumlahNeptu}, dalam tradisi dianggap selaras.`,
      })
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }

  // Urutkan: neptu tertinggi dulu (deterministik, lalu tanggal terlama dulu).
  kandidat.sort((x, y) => y.neptu - x.neptu || (x.tanggal < y.tanggal ? -1 : 1))

  return {
    kandidat: kandidat.slice(0, jumlah),
    sumber: SUMBER_METODE,
    disclaimer: DISCLAIMER_KANONIK,
  }
}

/**
 * usulNamaUsaha — 3-5 usulan nama usaha "selaras weton" (edukasi-budaya).
 * Deterministik: kombinasi unsur dari pasaran + neptu. BUKAN jaminan laris.
 */
export function usulNamaUsaha(weton: Weton, kataDasar: string): {
  usulan: string[]
  sumber: string
  disclaimer: string
} {
  const k = (kataDasar || 'Usaha').trim().replace(/\s+/g, ' ')
  const unsurPasaran: Record<Pasaran, string[]> = {
    Legi: ['Manis', 'Lestari', 'Rahayu'],
    Pahing: ['Teguh', 'Jaya', 'Perkasa'],
    Pon: ['Cendana', 'Cerdas', 'Wicaksana'],
    Wage: ['Setya', 'Makmur', 'Sentosa'],
    Kliwon: ['Mulya', 'Wibawa', 'Cahaya'],
  }
  const pilihan = unsurPasaran[weton.pasaran]
  const usulan = [
    `${k} ${pilihan[0]}`,
    `${pilihan[1]} ${k}`,
    `${k} ${pilihan[2]}`,
    `${k} ${weton.pasaran}`,
    `${pilihan[0]} ${k} ${weton.neptu}`,
  ].slice(0, 5)
  return {
    usulan,
    sumber: SUMBER_METODE,
    disclaimer: DISCLAIMER_KANONIK,
  }
}

/** Helper: parse 'yyyy-mm-dd' → Date UTC (aman, deterministik). */
export function parseTanggal(s: string): Date {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec((s || '').trim())
  if (!m) throw new Error('parseTanggal: format harus yyyy-mm-dd')
  const [, y, mo, d] = m
  const date = new Date(Date.UTC(Number(y), Number(mo) - 1, Number(d)))
  if (isNaN(date.getTime())) throw new Error('parseTanggal: tanggal tidak valid')
  return date
}
