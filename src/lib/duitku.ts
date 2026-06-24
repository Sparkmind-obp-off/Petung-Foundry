// ════════════════════════════════════════════════════════════════════════
// duitku.ts — Integrasi MoR Duitku POP (QRIS/VA) untuk Cloudflare Workers/Pages
// SSOT: B9-00 §5 (MoR = Oasis BI Pro Duitku) · B9-05 F2 PAY · B9-04 §6 (disclosure)
//
// 100% Web Crypto API (HMAC SHA256) → kompatibel edge (NO Node.js crypto).
// Secret (merchant code + API key) HANYA di server (env), TIDAK pernah ke frontend.
//
// Flow Duitku POP:
//   1. Frontend checkout → POST /api/checkout (server)
//   2. Server createInvoice ke Duitku → dapat `reference` + `paymentUrl`
//   3. Frontend: checkout.process(reference, {...}) via duitku.js (POP)
//   4. Duitku → callback POST ke /api/payment/callback (verifikasi signature)
// ════════════════════════════════════════════════════════════════════════

export interface DuitkuConfig {
  merchantCode: string
  apiKey: string
  env: 'sandbox' | 'production'
}

export interface CreateInvoiceInput {
  paymentAmount: number
  merchantOrderId: string
  productDetails: string
  email: string
  customerVaName?: string
  phoneNumber?: string
  callbackUrl: string
  returnUrl: string
  expiryPeriod?: number // menit
  itemDetails?: { name: string; price: number; quantity: number }[]
  customerDetail?: {
    firstName?: string
    lastName?: string
    email?: string
    phoneNumber?: string
  }
}

export interface CreateInvoiceResult {
  merchantCode: string
  reference: string
  paymentUrl: string
  statusCode: string
  statusMessage: string
}

const BASE_URL = {
  sandbox: 'https://api-sandbox.duitku.com',
  production: 'https://api-prod.duitku.com',
}

const JS_URL = {
  sandbox: 'https://app-sandbox.duitku.com/lib/js/duitku.js',
  production: 'https://app-prod.duitku.com/lib/js/duitku.js',
}

/** URL script duitku.js (POP) sesuai environment. */
export function duitkuJsUrl(env: 'sandbox' | 'production'): string {
  return JS_URL[env]
}

// ────────────────────────────────────────────────────────────────────────
// HMAC SHA256 via Web Crypto API (hex lowercase) — edge-native.
// ────────────────────────────────────────────────────────────────────────
async function hmacSha256Hex(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message))
  return [...new Uint8Array(sig)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Signature untuk createInvoice (header x-duitku-signature).
 * Formula: HMAC_SHA256(merchantCode + timestamp, apiKey)
 */
export async function signCreateInvoice(
  cfg: DuitkuConfig,
  timestamp: string
): Promise<string> {
  return hmacSha256Hex(cfg.merchantCode + timestamp, cfg.apiKey)
}

/**
 * Verifikasi signature callback dari Duitku.
 * Formula: HMAC_SHA256(merchantCode + amount + merchantOrderId, apiKey)
 */
export async function verifyCallbackSignature(
  cfg: DuitkuConfig,
  params: { merchantCode: string; amount: string; merchantOrderId: string; signature: string }
): Promise<boolean> {
  const expected = await hmacSha256Hex(
    params.merchantCode + params.amount + params.merchantOrderId,
    cfg.apiKey
  )
  // bandingkan case-insensitive (hex)
  return expected.toLowerCase() === (params.signature || '').toLowerCase()
}

/**
 * createInvoice — panggil Duitku backend, dapat reference + paymentUrl.
 * Dipakai server-side saja (butuh secret).
 */
export async function createInvoice(
  cfg: DuitkuConfig,
  input: CreateInvoiceInput
): Promise<CreateInvoiceResult> {
  const timestamp = Date.now().toString()
  const signature = await signCreateInvoice(cfg, timestamp)

  const body = {
    paymentAmount: input.paymentAmount,
    merchantOrderId: input.merchantOrderId,
    productDetails: input.productDetails,
    additionalParam: '',
    merchantUserInfo: '',
    paymentMethod: '', // kosong = tampilkan semua metode (QRIS/VA/e-wallet) di POP
    customerVaName: input.customerVaName ?? input.email,
    email: input.email,
    phoneNumber: input.phoneNumber ?? '',
    itemDetails: input.itemDetails ?? [
      { name: input.productDetails, price: input.paymentAmount, quantity: 1 },
    ],
    customerDetail: input.customerDetail ?? { email: input.email },
    callbackUrl: input.callbackUrl,
    returnUrl: input.returnUrl,
    expiryPeriod: input.expiryPeriod ?? 60,
  }

  const res = await fetch(`${BASE_URL[cfg.env]}/api/merchant/createInvoice`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-duitku-timestamp': timestamp,
      'x-duitku-signature': signature,
      'x-duitku-merchantcode': cfg.merchantCode,
    },
    body: JSON.stringify(body),
  })

  const text = await res.text()
  let data: any
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error(`Duitku response tidak valid (HTTP ${res.status}): ${text.slice(0, 200)}`)
  }

  if (!res.ok || data?.statusCode !== '00') {
    throw new Error(
      `Duitku createInvoice gagal: ${data?.statusMessage || text || 'unknown'} (HTTP ${res.status})`
    )
  }

  return data as CreateInvoiceResult
}

/** Helper: baca config Duitku dari env (Cloudflare bindings / .dev.vars). */
export function getDuitkuConfig(env: any): DuitkuConfig | null {
  const merchantCode = env?.DUITKU_MERCHANT_CODE
  const apiKey = env?.DUITKU_API_KEY
  if (!merchantCode || !apiKey) return null
  const e = (env?.DUITKU_ENV || 'sandbox').toLowerCase()
  return {
    merchantCode,
    apiKey,
    env: e === 'production' ? 'production' : 'sandbox',
  }
}

/** Generate merchantOrderId unik & deterministik-ish (slug + waktu + acak). */
export function genMerchantOrderId(slugPrefix: string): string {
  const t = Date.now().toString(36).toUpperCase()
  const r = Math.random().toString(36).slice(2, 7).toUpperCase()
  const p = (slugPrefix || 'ORD').replace(/[^a-zA-Z0-9]/g, '').slice(0, 8).toUpperCase()
  return `PTG-${p}-${t}${r}`
}
