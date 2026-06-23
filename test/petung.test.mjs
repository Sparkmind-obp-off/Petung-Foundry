// Unit test mesin-pétung — rencana B9-05 §3.4
// Dijalankan dengan: npm test  (node --test)
// Catatan: test mengimpor logika inti yang diduplikasi-ringan di sini agar
// independen dari build TS. Logika harus identik dengan src/lib/petung.ts.

import test from 'node:test'
import assert from 'node:assert/strict'

// ── Replikasi logika deterministik (mirror dari src/lib/petung.ts) ──
const NEPTU_HARI = { Minggu: 5, Senin: 4, Selasa: 3, Rabu: 7, Kamis: 8, Jumat: 6, Sabtu: 9 }
const NEPTU_PASARAN = { Legi: 5, Pahing: 9, Pon: 7, Wage: 4, Kliwon: 8 }
const SIKLUS_PASARAN = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon']
const NAMA_HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
const EPOCH_PASARAN_INDEX = 3 // 1970-01-01 = Wage
const MS_PER_DAY = 86400000
const mod = (n, m) => ((n % m) + m) % m
const toUtcDays = (d) =>
  Math.floor(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) / MS_PER_DAY)

function getWeton(date) {
  const hari = NAMA_HARI[date.getUTCDay()]
  const pasaran = SIKLUS_PASARAN[mod(EPOCH_PASARAN_INDEX + toUtcDays(date), 5)]
  const neptuHari = NEPTU_HARI[hari]
  const neptuPasaran = NEPTU_PASARAN[pasaran]
  return { hari, pasaran, neptuHari, neptuPasaran, neptu: neptuHari + neptuPasaran }
}

const U = (y, m, d) => new Date(Date.UTC(y, m - 1, d))

// ── TEST 1: Weton tanggal patok ──
test('epoch 1970-01-01 = Kamis Wage, neptu 8+4=12', () => {
  const w = getWeton(U(1970, 1, 1))
  assert.equal(w.hari, 'Kamis')
  assert.equal(w.pasaran, 'Wage')
  assert.equal(w.neptu, 12)
})

// ── TEST 2: Idempotensi (no drift) ──
test('idempoten: dipanggil 2x output identik', () => {
  const a = getWeton(U(2000, 2, 29))
  const b = getWeton(U(2000, 2, 29))
  assert.deepEqual(a, b)
})

// ── TEST 3: Siklus pasaran 5 tanggal berurutan ──
test('5 tanggal berurutan = siklus pasaran benar', () => {
  const start = getWeton(U(2026, 6, 23))
  const startIdx = SIKLUS_PASARAN.indexOf(start.pasaran)
  for (let i = 0; i < 5; i++) {
    const w = getWeton(U(2026, 6, 23 + i))
    assert.equal(w.pasaran, SIKLUS_PASARAN[mod(startIdx + i, 5)])
  }
})

// ── TEST 4: Tahun kabisat / pergantian abad ──
test('29 Feb 2000 valid (tahun kabisat abad)', () => {
  const w = getWeton(U(2000, 2, 29))
  assert.ok(NAMA_HARI.includes(w.hari))
  assert.ok(SIKLUS_PASARAN.includes(w.pasaran))
  // 2000-02-29 adalah hari Selasa (Gregorian)
  assert.equal(w.hari, 'Selasa')
})

// ── TEST 5: Neptu = neptuHari + neptuPasaran (konsistensi) ──
test('neptu selalu = jumlah komponen', () => {
  for (let i = 0; i < 35; i++) {
    const w = getWeton(U(2026, 1, 1 + i))
    assert.equal(w.neptu, w.neptuHari + w.neptuPasaran)
  }
})

// ── TEST 6: Hari Gregorian benar untuk tanggal terkenal ──
test('17 Agustus 1945 = hari Jumat', () => {
  const w = getWeton(U(1945, 8, 17))
  assert.equal(w.hari, 'Jumat')
})
