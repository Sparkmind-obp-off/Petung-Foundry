-- Seed data demo (local dev) — Pétung Foundry
INSERT OR IGNORE INTO leads (nama, kontak, hajat, catatan, status) VALUES
  ('Siti Rahayu', '0812xxxx1234', 'pengantin', 'Rencana nikah Oktober, butuh hari baik + undangan.', 'baru'),
  ('Budi Santoso', 'budi@example.com', 'usaha', 'Buka warung kopi, butuh hari baik + nama.', 'dihubungi');

INSERT OR IGNORE INTO orders (merchant_order_id, sku_slug, sku_nama, plan_mode, amount, nama, email, phone, status, result_code) VALUES
  ('DEMO-PGN-0001', 'petung-pengantin', 'Pétung Pengantin', 'DWY', 199000, 'Siti Rahayu', 'siti@example.com', '0812xxxx1234', 'paid', '00'),
  ('DEMO-KWT-0002', 'kartu-weton', 'Kartu Weton', 'DWY', 29000, 'Andi', 'andi@example.com', '0813xxxx5678', 'pending', NULL);
