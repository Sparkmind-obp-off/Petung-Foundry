// ════════════════════════════════════════════════════════════════════════
// solutions.ts — Katalog SKU Pétung (outcome niche Jawa)
// SSOT: B9-03 (monetization matrix) · B9-02 (naming = outcome)
//
// ⚠️ Truth-Lock (B9-00 §6 + B9-03 §11 + pola R6-4):
//   Harga = USULAN/DRAFT. price_idr = null sampai disetujui HITL owner
//   (pricing + legal + customer-facing). UI menampilkan "harga menunggu
//   konfirmasi" alih-alih nominal final. priceDraft hanya catatan SSOT.
// ════════════════════════════════════════════════════════════════════════

export type PlanMode = 'DIY' | 'DWY' | 'DFY'

export interface Plan {
  mode: PlanMode
  label: string
  isi: string
  priceDraft: string // catatan SSOT (USULAN) — bukan harga final
}

export interface Solution {
  slug: string
  stream: 'S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'S6'
  streamLabel: string
  nama: string
  promise: string // outcome dijual (LOLOS Truth-Lock B9-04)
  problem: string
  icp: string
  outcomes: string[]
  valueMetric: string // proof deterministik
  priceIdr: number | null // null = menunggu HITL pricing (R6-4)
  priceDraft: string // USULAN SSOT (untuk owner saat HITL)
  plans: Plan[]
  engineSkills: string[]
  /** SKU yang punya tool interaktif live di webapp v1 */
  toolPath?: string
  badge?: string
}

export const SOLUTIONS: Solution[] = [
  // ── [S1] Tripwire / Akuisisi ──
  {
    slug: 'kartu-weton',
    stream: 'S1',
    streamLabel: 'Tripwire',
    nama: 'Kartu Weton',
    promise:
      'Dapatkan kartu watak & weton-mu versi primbon yang cantik untuk dibagikan.',
    problem:
      'Kalkulator weton yang ada berantakan, penuh iklan, dan hasilnya tidak bisa dibagikan dengan rapi.',
    icp: 'Individu / Gen Z penasaran wetonnya',
    outcomes: [
      'Kartu digital weton + neptu + watak (versi primbon)',
      'Desain rapi & siap dibagikan ke media sosial',
      'Disclaimer edukasi-budaya menempel pada kartu',
    ],
    valueMetric: 'Kartu jadi & dapat diunduh/dibagikan',
    priceIdr: null,
    priceDraft: 'Rp 0 (lead) – 29.000',
    plans: [
      { mode: 'DIY', label: 'Gratis (lead)', isi: 'Cek weton + kartu basic', priceDraft: 'Rp 0' },
      { mode: 'DWY', label: 'Kartu Premium', isi: 'Kartu desain premium + watak lengkap', priceDraft: 'Rp 29.000' },
    ],
    engineSkills: ['content-generation', 'fullstack-cycle', 'mesin-pétung'],
    toolPath: '/petung/cek',
    badge: 'Gratis · Coba dulu',
  },
  {
    slug: 'cek-kecocokan',
    stream: 'S1',
    streamLabel: 'Tripwire',
    nama: 'Cek Kecocokan (Weton Jodoh)',
    promise:
      'Ringkasan kecocokan dua weton menurut primbon — sebagai edukasi-budaya, bukan kepastian.',
    problem:
      'Penasaran tafsir tradisi tentang kecocokan dua weton, tapi sumber online tidak transparan metodenya.',
    icp: 'Pasangan / individu penasaran (ICP-1/4)',
    outcomes: [
      'Hitung neptu dua weton (deterministik)',
      'Tafsir tradisi (metode neptu jodoh) + sumber metode',
      'PDF ringkasan (versi berbayar)',
    ],
    valueMetric: 'Ringkasan kecocokan + sumber metode tampil',
    priceIdr: null,
    priceDraft: 'Rp 49.000',
    plans: [
      { mode: 'DIY', label: 'Cek Online', isi: 'Hasil kecocokan + tafsir tradisi', priceDraft: 'Rp 0 – 49.000' },
    ],
    engineSkills: ['mesin-pétung', 'content-generation'],
    toolPath: '/petung/jodoh',
    badge: 'Tool gratis',
  },

  // ── [S2] Produk inti — beachhead ──
  {
    slug: 'petung-pengantin',
    stream: 'S2',
    streamLabel: 'Produk Inti (Beachhead)',
    nama: 'Pétung Pengantin',
    promise:
      'Susun kalender hari baik pernikahanmu menurut tradisi Jawa — rapi, dipersonalisasi, siap dibagikan keluarga.',
    problem:
      'Mencari hari baik pernikahan secara manual ribet; hasil dari dukun/jasa informal tidak rapi & tidak bisa dibagikan.',
    icp: 'Calon pengantin & keluarga Jawa (ICP-1)',
    outcomes: [
      'Kalender hari baik pernikahan (opsi tanggal + neptu + penjelasan tradisi)',
      'Panduan persiapan hajat',
      'Halaman/undangan live (opsi)',
    ],
    valueMetric: 'Kalender hari baik + halaman live & dapat diakses',
    priceIdr: null,
    priceDraft: 'Rp 199.000–499.000 (+ opsi Rp 49k/bln halaman aktif)',
    plans: [
      { mode: 'DIY', label: 'DIY', isi: 'Tool hari baik + template panduan', priceDraft: 'Rp 99.000' },
      { mode: 'DWY', label: 'Done-with-You', isi: 'Kami susun kalender + halaman undangan live', priceDraft: 'Rp 199.000 (+ opsi 49k/bln)' },
      { mode: 'DFY', label: 'Done-for-You', isi: 'Paket hajat lengkap (undangan + RSVP + konten + halaman)', priceDraft: 'Rp 1.500.000+' },
    ],
    engineSkills: ['fullstack-cycle', 'cf-byok-deploy', 'squad-product', 'mesin-pétung'],
    toolPath: '/petung/hari-baik',
    badge: 'Beachhead ⭐',
  },
  {
    slug: 'petung-usaha',
    stream: 'S2',
    streamLabel: 'Produk Inti',
    nama: 'Pétung Usaha',
    promise:
      'Mulai usaha di hari baik + 3–5 usulan nama yang selaras weton menurut tradisi. Pilihan tetap di tanganmu.',
    problem:
      'Pemilik usaha ingin memulai di hari baik & nama yang bermakna, tapi tidak punya panduan rapi.',
    icp: 'UMKM / calon wirausaha (ICP-2)',
    outcomes: [
      'Daftar hari baik buka usaha',
      '3–5 usulan nama usaha selaras weton',
      '(Upsell) profil/toko online live',
    ],
    valueMetric: 'PDF hari baik + usulan nama + (opsi) toko live',
    priceIdr: null,
    priceDraft: 'Rp 149.000–399.000',
    plans: [
      { mode: 'DIY', label: 'DIY', isi: 'Tool hari baik usaha + generator nama', priceDraft: 'Rp 149.000' },
      { mode: 'DWY', label: 'Done-with-You', isi: 'Kami susun + cross-sell Toko Online', priceDraft: 'Rp 399.000' },
      { mode: 'DFY', label: 'Usaha Pro (DFY)', isi: 'Hari baik + nama + Toko Online/BarberKas jadi & live', priceDraft: 'mulai Rp 2.000.000' },
    ],
    engineSkills: ['fullstack-cycle', 'squad-marketing', 'gtm-engineering', 'mesin-pétung'],
    toolPath: '/petung/nama-usaha',
    badge: 'Jembatan ke Toko Online',
  },
  {
    slug: 'petung-hajat',
    stream: 'S2',
    streamLabel: 'Produk Inti',
    nama: 'Pétung Hajat',
    promise:
      'Temukan hari baik untuk hajat lain (pindahan, sunatan, syukuran) menurut tradisi Jawa + panduan.',
    problem:
      'Hajat selain nikah juga butuh hari baik, tapi informasinya tersebar & tidak rapi.',
    icp: 'Keluarga Jawa (ICP-1/2)',
    outcomes: [
      'Daftar hari baik untuk hajat pilihan',
      'Panduan persiapan singkat',
      'Disclaimer edukasi-budaya',
    ],
    valueMetric: 'Daftar hari baik + panduan dapat diakses',
    priceIdr: null,
    priceDraft: 'Rp 99.000–249.000',
    plans: [
      { mode: 'DIY', label: 'DIY', isi: 'Tool hari baik hajat + panduan', priceDraft: 'Rp 99.000' },
      { mode: 'DWY', label: 'Done-with-You', isi: 'Kami susun kalender + panduan', priceDraft: 'Rp 249.000' },
    ],
    engineSkills: ['fullstack-cycle', 'mesin-pétung'],
    toolPath: '/petung/hari-baik',
  },

  // ── [S3] Langganan & continuity (MRR) ──
  {
    slug: 'kalender-petung',
    stream: 'S3',
    streamLabel: 'Langganan (MRR)',
    nama: 'Kaléndér Pétung',
    promise:
      'Kalender hari baik tahunan dipersonalisasi (per weton) + reminder momen penting.',
    problem:
      'Butuh acuan hari baik sepanjang tahun tanpa hitung manual berulang.',
    icp: 'Semua segmen',
    outcomes: [
      'Kalender hari baik tahunan per weton',
      'Reminder momen hajat',
      'Update tahunan',
    ],
    valueMetric: 'Kalender tahunan terkirim + reminder aktif',
    priceIdr: null,
    priceDraft: 'Rp 99.000/thn atau Rp 19.000/bln',
    plans: [
      { mode: 'DWY', label: 'Langganan Tahunan', isi: 'Kalender + reminder', priceDraft: 'Rp 99.000/thn' },
    ],
    engineSkills: ['workflow-ops', 'hermes-memory', 'mesin-pétung'],
  },

  // ── [S4] High-ticket & DFY ──
  {
    slug: 'paket-hajat-lengkap',
    stream: 'S4',
    streamLabel: 'High-Ticket (DFY)',
    nama: 'Paket Hajat Lengkap (DFY)',
    promise:
      'Hari baik + undangan + RSVP + halaman + konten — dirakit penuh oleh tim kami.',
    problem:
      'Pengantin premium mau semua beres tanpa pusing menyusun sendiri.',
    icp: 'Pengantin premium',
    outcomes: [
      'Hari baik pernikahan',
      'Undangan + RSVP + halaman live',
      'Konten siap pakai',
    ],
    valueMetric: 'Semua artefak jadi & live (URL + file)',
    priceIdr: null,
    priceDraft: 'Rp 1.500.000+',
    plans: [
      { mode: 'DFY', label: 'Done-for-You', isi: 'Paket lengkap dirakit', priceDraft: 'Rp 1.500.000+' },
    ],
    engineSkills: ['orchestrator', 'MomentKas', 'fullstack-cycle'],
    badge: 'Premium',
  },

  // ── [S5] Partner / white-label ──
  {
    slug: 'petung-partner',
    stream: 'S5',
    streamLabel: 'Partner / White-Label',
    nama: 'Pétung Partner (White-Label)',
    promise:
      'WO/EO/percetakan menjual layanan "hari baik" dengan brand sendiri di atas mesin Pétung.',
    problem:
      'Vendor pernikahan ingin menambah layanan hari baik tanpa membangun mesin sendiri.',
    icp: 'WO / EO / percetakan (ICP-3)',
    outcomes: ['Akses mesin pétung white-label', 'Rel bayar (MoR)', 'Rev-share'],
    valueMetric: 'Partner dapat menjual outcome dgn brand sendiri',
    priceIdr: null,
    priceDraft: 'rev-share 30–50%',
    plans: [
      { mode: 'DFY', label: 'Kemitraan', isi: 'Setup white-label + rev-share', priceDraft: 'rev-share 30–50%' },
    ],
    engineSkills: ['zero-trust', 'legal', 'engine-checkout-MoR'],
  },

  // ── [S6] Edukasi / Authority ──
  {
    slug: 'kelas-weton',
    stream: 'S6',
    streamLabel: 'Edukasi',
    nama: 'Kelas "Weton & Filosofi Jawa"',
    promise:
      'Mini-course edukasi-budaya: memahami weton, neptu, dan filosofi Jawa dengan benar.',
    problem:
      'Banyak yang ingin memahami weton secara benar & hormat, bukan sekadar mitos.',
    icp: 'Penasaran budaya (ICP-4/5)',
    outcomes: ['Materi terstruktur', 'Edukasi-budaya, bukan klenik', 'Sertifikat partisipasi'],
    valueMetric: 'Akses kelas + materi',
    priceIdr: null,
    priceDraft: 'Rp 99.000–199.000',
    plans: [
      { mode: 'DWY', label: 'Kelas', isi: 'Akses mini-course', priceDraft: 'Rp 99.000–199.000' },
    ],
    engineSkills: ['content-generation', 'MomentKas'],
  },
]

export function getSolution(slug: string): Solution | undefined {
  return SOLUTIONS.find((s) => s.slug === slug)
}

export const STREAMS = [
  { id: 'S1', label: 'Tripwire / Akuisisi' },
  { id: 'S2', label: 'Produk Inti' },
  { id: 'S3', label: 'Langganan (MRR)' },
  { id: 'S4', label: 'High-Ticket / DFY' },
  { id: 'S5', label: 'Partner / White-Label' },
  { id: 'S6', label: 'Edukasi' },
] as const
