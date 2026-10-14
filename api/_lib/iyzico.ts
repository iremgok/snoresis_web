// iyzico REST istemcisi (IYZWSv2 imzası) — yalnızca sunucuda çalışır.
//
// Ortam değişkenleri (Vercel > Settings > Environment Variables):
//   IYZICO_API_KEY, IYZICO_SECRET_KEY  — iyzico panelinden; istemciye ASLA gönderilmez
//   IYZICO_BASE_URL                    — https://sandbox-api.iyzipay.com (test) | https://api.iyzipay.com (canlı)
//
// Kart bilgileri bu sunucudan geçmez: Checkout Form, kartı iyzico'nun barındırdığı sayfada
// 3D Secure ile alır (PCI-DSS SAQ-A). Biz yalnızca sunucuda hesaplanan tutarla formu başlatır
// ve sonuçta ödemeyi iyzico'dan yeniden sorgularız.

import { createHmac, randomBytes } from 'node:crypto';

const env = (name: string) => {
  const v = process.env[name];
  if (!v) throw new Error(`[iyzico] ${name} tanımlı değil`);
  return v;
};

const baseUrl = () => (process.env.IYZICO_BASE_URL ?? 'https://sandbox-api.iyzipay.com').replace(/\/$/, '');

const authHeaders = (path: string, body: string) => {
  const apiKey = env('IYZICO_API_KEY');
  const secretKey = env('IYZICO_SECRET_KEY');
  const randomKey = `${Date.now()}${randomBytes(8).toString('hex')}`;
  const signature = createHmac('sha256', secretKey)
    .update(randomKey + path + body)
    .digest('hex');
  const auth = Buffer.from(`apiKey:${apiKey}&randomKey:${randomKey}&signature:${signature}`).toString('base64');
  return {
    Authorization: `IYZWSv2 ${auth}`,
    'x-iyzi-rnd': randomKey,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
};

export interface IyzicoResponse {
  status: 'success' | 'failure';
  errorCode?: string;
  errorMessage?: string;
  [key: string]: unknown;
}

const call = async <T extends IyzicoResponse>(path: string, payload: unknown): Promise<T> => {
  const body = JSON.stringify(payload);
  const res = await fetch(baseUrl() + path, {
    method: 'POST',
    headers: authHeaders(path, body),
    body,
    signal: AbortSignal.timeout(15_000),
  });
  const data = (await res.json()) as T;
  if (data.status !== 'success') {
    console.error('[iyzico]', path, data.errorCode, data.errorMessage);
  }
  return data;
};

/** iyzico tutarları ondalık string ister ("6999.00"). */
export const money = (n: number) => n.toFixed(2);

export interface CheckoutFormInit extends IyzicoResponse {
  token?: string;
  paymentPageUrl?: string;
  tokenExpireTime?: number;
}

export const initializeCheckoutForm = (payload: Record<string, unknown>) =>
  call<CheckoutFormInit>('/payment/iyzipos/checkoutform/initialize/auth/ecom', payload);

export interface CheckoutFormResult extends IyzicoResponse {
  paymentStatus?: 'SUCCESS' | 'FAILURE' | 'INIT_THREEDS' | 'CALLBACK_THREEDS' | 'BKM_POS_SELECTED' | 'CALLBACK_PECCO';
  fraudStatus?: number;
  paymentId?: string;
  basketId?: string;
  conversationId?: string;
  currency?: string;
  price?: number;
  paidPrice?: number;
  itemTransactions?: { itemId: string; price: number; paidPrice: number }[];
}

export const retrieveCheckoutForm = (token: string, conversationId?: string) =>
  call<CheckoutFormResult>('/payment/iyzipos/checkoutform/auth/ecom/detail', {
    locale: 'tr',
    conversationId,
    token,
  });

/** Ödemeyi tamamen iptal eder (aynı gün, gün sonu öncesi). Tutar uyuşmazlığında para iade edilir. */
export const cancelPayment = (paymentId: string, ip: string, conversationId?: string) =>
  call<IyzicoResponse>('/payment/cancel', { locale: 'tr', conversationId, paymentId, ip });
