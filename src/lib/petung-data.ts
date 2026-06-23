// ════════════════════════════════════════════════════════════════════════
// petung-data.ts — Tabel referensi neptu + tafsir + atribusi sumber primbon
// SSOT: B9-05 §3.1 (tabel neptu) · B9-04 (Truth-Lock: atribusi + variasi)
//
// CATATAN VARIASI (Truth-Lock B9-04 §1): ada perbedaan kecil antar daerah/aliran
// primbon. Tabel di bawah = versi paling umum/standar. Sumber/metode WAJIB
// ditampilkan ke pengguna; TIDAK ADA klaim "satu-satunya benar".
// ════════════════════════════════════════════════════════════════════════

export type Pasaran = 'Legi' | 'Pahing' | 'Pon' | 'Wage' | 'Kliwon'
export type HariNama =
  | 'Minggu'
  | 'Senin'
  | 'Selasa'
  | 'Rabu'
  | 'Kamis'
  | 'Jumat'
  | 'Sabtu'

// Neptu Hari (Saptawara) — B9-05 §3.1
export const NEPTU_HARI: Record<HariNama, number> = {
  Minggu: 5,
  Senin: 4,
  Selasa: 3,
  Rabu: 7,
  Kamis: 8,
  Jumat: 6,
  Sabtu: 9,
}

// Neptu Pasaran (Pancawara) — B9-05 §3.1
export const NEPTU_PASARAN: Record<Pasaran, number> = {
  Legi: 5,
  Pahing: 9,
  Pon: 7,
  Wage: 4,
  Kliwon: 8,
}

// Urutan siklus pasaran (Pancawara). Epoch acuan: 1970-01-01 (Kamis) = Wage.
// Sumber acuan epoch: konvensi primbon Jawa umum (1 Jan 1970 = Kamis Wage).
export const SIKLUS_PASARAN: Pasaran[] = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon']

// Nama hari sesuai getUTCDay() (0=Minggu)
export const NAMA_HARI: HariNama[] = [
  'Minggu',
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
]

// ────────────────────────────────────────────────────────────────────────
// Tafsir watak ringkas per pasaran (edukasi-budaya — versi primbon umum).
// Truth-Lock: ini TAFSIR TRADISI, bukan kepastian. Disajikan netral & hormat.
// ────────────────────────────────────────────────────────────────────────
export const WATAK_PASARAN: Record<Pasaran, string> = {
  Legi:
    'Dalam tradisi Jawa, weton berpasaran Legi sering digambarkan tenang, ramah, dan murah hati.',
  Pahing:
    'Dalam tradisi Jawa, weton berpasaran Pahing sering digambarkan tegas, mandiri, dan berpendirian.',
  Pon:
    'Dalam tradisi Jawa, weton berpasaran Pon sering digambarkan cerdas, terampil bicara, dan supel.',
  Wage:
    'Dalam tradisi Jawa, weton berpasaran Wage sering digambarkan teguh, pekerja keras, dan setia.',
  Kliwon:
    'Dalam tradisi Jawa, weton berpasaran Kliwon sering digambarkan peka, bijaksana, dan berwibawa.',
}

// ────────────────────────────────────────────────────────────────────────
// Tafsir kecocokan (jodoh) menurut metode "sisa bagi 1 jumlah neptu" (mod 1..)
// Metode umum: jumlah neptu dua weton dihitung, lalu ditafsir menurut primbon.
// Di sini kita pakai tafsir berbasis hasil mod-tertentu (metode neptu jodoh).
// Truth-Lock: tafsir = TRADISI, bukan jaminan rumah tangga.
// ────────────────────────────────────────────────────────────────────────
export interface TafsirJodoh {
  nama: string
  arti: string
}

// Metode "jumlah neptu mod 8" → tafsir tradisi (Pegat, Ratu, Jodoh, Topo,
// Tinari, Padu, Sujanan, Pesthi). Sumber: primbon Jawa umum (perhitungan jodoh).
export const TAFSIR_JODOH_MOD8: Record<number, TafsirJodoh> = {
  1: {
    nama: 'Pegat',
    arti:
      'Menurut primbon, pasangan ini disarankan banyak menjaga komunikasi & kesabaran. Bersifat tradisi, bukan kepastian.',
  },
  2: {
    nama: 'Ratu',
    arti:
      'Menurut primbon, weton ini dianggap serasi & dihormati lingkungan. Bersifat tradisi, bukan jaminan.',
  },
  3: {
    nama: 'Jodoh',
    arti:
      'Menurut primbon, pasangan dianggap saling menerima kelebihan & kekurangan. Tafsir budaya, bukan kepastian.',
  },
  4: {
    nama: 'Topo',
    arti:
      'Menurut primbon, awal hubungan butuh penyesuaian, lalu diharapkan membaik. Bersifat tradisi.',
  },
  5: {
    nama: 'Tinari',
    arti:
      'Menurut primbon, weton ini dianggap membawa keharmonisan & rezeki. Tafsir budaya, bukan jaminan.',
  },
  6: {
    nama: 'Padu',
    arti:
      'Menurut primbon, perlu kelapangan hati agar selisih kecil tak membesar. Bersifat tradisi, bukan vonis.',
  },
  7: {
    nama: 'Sujanan',
    arti:
      'Menurut primbon, dianjurkan saling percaya & terbuka. Ini tafsir budaya, keputusan tetap milik Anda.',
  },
  0: {
    nama: 'Pesthi',
    arti:
      'Menurut primbon, pasangan dianggap rukun & tentram. Bersifat tradisi-budaya, bukan kepastian.',
  },
}

// ────────────────────────────────────────────────────────────────────────
// Kriteria "hari baik" — metode umum: jumlah neptu hari kandidat dianggap
// "baik" bila tidak jatuh pada neptu yang secara tradisi dihindari, dan
// idealnya selaras/seimbang dengan weton pemilik hajat.
// Truth-Lock: ini metode tradisi & dapat diaudit, BUKAN ramalan pasti.
// ────────────────────────────────────────────────────────────────────────

// Atribusi & catatan sumber (WAJIB ditampilkan — B9-04 §7).
export const SUMBER_METODE =
  'Perhitungan mengikuti metode primbon Jawa umum (neptu hari + pasaran). ' +
  'Terdapat variasi antar daerah/aliran; ini salah satu metode standar, ' +
  'bukan satu-satunya yang benar.'

// Disclaimer kanonik (B9-04 §3) — dipakai di artefak & hasil.
export const DISCLAIMER_KANONIK =
  'Pétung menyajikan perhitungan weton & primbon sebagai warisan budaya & ' +
  'edukasi Jawa. Hasil bersifat tradisi/kultural, bukan kepastian ilmiah ' +
  'maupun jaminan atas kejadian di masa depan. Keputusan tetap ada di tangan ' +
  'Anda. Kami menghormati semua keyakinan.'

export const DISCLAIMER_MICRO = 'Edukasi-budaya, bukan kepastian. — Pétung by SparkMind'
