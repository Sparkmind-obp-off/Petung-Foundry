-- ════════════════════════════════════════════════════════════════════════
-- 0001_initial_schema.sql — Pétung Foundry · persistensi intake/leads + orders
-- SSOT: B9-05 §4 (data: reuse tabel leads/orders) · B9-04 §6 (UU PDP: simpan minimal)
--
-- Truth-Lock / PDP: tanggal lahir = data pribadi → kolom opsional, bisa dihapus.
-- Tidak menyimpan data lebih dari yang dibutuhkan untuk deliver artefak.
-- ════════════════════════════════════════════════════════════════════════

-- Leads (intake konsultasi / mulai pesanan)
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nama TEXT NOT NULL,
  kontak TEXT NOT NULL,            -- WhatsApp / email
  hajat TEXT,                      -- pengantin | usaha | hajat | lain
  catatan TEXT,
  sumber TEXT DEFAULT 'web',       -- channel asal
  status TEXT DEFAULT 'baru',      -- baru | dihubungi | closing | batal
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at);

-- Orders (checkout SKU via MoR Duitku QRIS/VA)
-- price_idr = nominal yang dibayar (sudah disetujui HITL untuk SKU live).
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  merchant_order_id TEXT UNIQUE NOT NULL,   -- ID unik order kami (dikirim ke Duitku)
  reference TEXT,                           -- Duitku reference (disimpan utk trace)
  sku_slug TEXT NOT NULL,                   -- slug SKU dari solutions.ts
  sku_nama TEXT NOT NULL,
  plan_mode TEXT,                           -- DIY | DWY | DFY
  amount INTEGER NOT NULL,                  -- nominal IDR
  nama TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  status TEXT DEFAULT 'pending',            -- pending | paid | failed | expired
  result_code TEXT,                         -- kode hasil dari callback (00 = sukses)
  payment_code TEXT,                        -- metode bayar (VA/QRIS/dst)
  lead_id INTEGER,                          -- relasi ke leads (opsional)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  paid_at DATETIME,
  FOREIGN KEY (lead_id) REFERENCES leads(id)
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_reference ON orders(reference);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);
