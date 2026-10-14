// POST /api/payment/initialize
//   { items: "smart_wristband:black:1,...", buyer: {...}, source: "web" | "app" }
// → 200 { orderId, total, paymentPageUrl }  |  400 { error, fields? }  |  502 { error }
//
// Tutar istemciden ALINMAZ: sepet sunucudaki katalogla yeniden fiyatlanır ve iyzico Checkout
// Form bu tutarla başlatılır. Kullanıcı `paymentPageUrl`'e (iyzico'nun 3D Secure ödeme sayfası)
// yönlendirilir; sonuç /api/payment/callback'e döner.
//
// Sipariş, iyzico'ya gitmeden önce Supabase `orders` tablosuna `payment_status = 'pending'` olarak
// yazılır: iyzico'nun sonuç sorgusu alıcı e-postası ve adresini döndürmediği için bu bilgiler
// geri dönüşte buradan okunur. Kayıt yazılamazsa ödeme başlatılmaz (sipariş kaybolmaz).

import { randomBytes } from 'node:crypto';
import { CartError, lineItemId, priceCart } from '../_lib/catalog.js';
import { clientIp, json, readJson, siteUrl } from '../_lib/http.js';
import { initializeCheckoutForm, money } from '../_lib/iyzico.js';
import { insertOrder, ordersConfigured, updateOrder } from '../_lib/orders.js';

interface Buyer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
}

interface Body {
  items?: string;
  buyer?: Partial<Buyer>;
  source?: string;
}

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

/** 05xx / 5xx / +905xx → +905xxxxxxxxx */
const normalizePhone = (v: string) => {
  const digits = v.replace(/\D/g, '').replace(/^0090|^90|^0/, '');
  return /^5\d{9}$/.test(digits) ? `+90${digits}` : null;
};

const validateBuyer = (b: Partial<Buyer> = {}) => {
  const buyer: Buyer = {
    firstName: str(b.firstName, 50),
    lastName: str(b.lastName, 50),
    email: str(b.email, 120),
    phone: str(b.phone, 20),
    city: str(b.city, 40),
    address: str(b.address, 300),
  };
  const fields: string[] = [];
  if (buyer.firstName.length < 2) fields.push('firstName');
  if (buyer.lastName.length < 2) fields.push('lastName');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyer.email)) fields.push('email');
  const gsm = normalizePhone(buyer.phone);
  if (!gsm) fields.push('phone');
  if (buyer.city.length < 2) fields.push('city');
  if (buyer.address.length < 10) fields.push('address');
  return { buyer, gsm: gsm ?? '', fields };
};

const newOrderId = () =>
  `SNR-${new Date().getFullYear()}-${randomBytes(4).readUInt32BE(0).toString(36).toUpperCase().padStart(6, '0').slice(-6)}`;

export async function POST(req: Request) {
  const body = await readJson<Body>(req);
  if (!body) return json(400, { error: 'invalid_json' });

  let cart: ReturnType<typeof priceCart>;
  try {
    cart = priceCart(str(body.items, 500));
  } catch (err) {
    if (err instanceof CartError) return json(400, { error: 'invalid_cart', message: err.message });
    throw err;
  }

  const { buyer, gsm, fields } = validateBuyer(body.buyer);
  if (fields.length) return json(400, { error: 'invalid_buyer', fields });

  if (!ordersConfigured()) {
    console.error('[payment/initialize] sipariş veritabanı yapılandırılmamış');
    return json(503, { error: 'orders_unavailable' });
  }

  const source = body.source === 'app' ? 'app' : 'web';
  const orderId = newOrderId();
  try {
    await insertOrder({
      id: orderId,
      email: buyer.email.toLowerCase(),
      source,
      total: cart.total,
      items: cart.lines.map((l) => ({
        productId: l.productId,
        name: l.name,
        color: l.color,
        quantity: l.quantity,
        price: l.unitPrice,
      })),
      shipping: {
        firstName: buyer.firstName,
        lastName: buyer.lastName,
        phone: gsm,
        city: buyer.city,
        address: buyer.address,
      },
    });
  } catch (err) {
    console.error('[payment/initialize] sipariş kaydedilemedi', err);
    return json(503, { error: 'orders_unavailable' });
  }

  const ip = clientIp(req);
  const contactName = `${buyer.firstName} ${buyer.lastName}`;
  const address = { contactName, city: buyer.city, country: 'Turkey', address: buyer.address };
  const total = money(cart.total);

  const result = await initializeCheckoutForm({
    locale: 'tr',
    conversationId: orderId,
    price: total,
    paidPrice: total,
    currency: 'TRY',
    basketId: orderId,
    paymentGroup: 'PRODUCT',
    callbackUrl: `${siteUrl(req)}/api/payment/callback?source=${source}`,
    enabledInstallments: [1, 2, 3, 6, 9],
    buyer: {
      id: buyer.email.toLowerCase(),
      name: buyer.firstName,
      surname: buyer.lastName,
      gsmNumber: gsm,
      email: buyer.email,
      // Bireysel satışta T.C. kimlik no istenmez; iyzico'nun kabul ettiği yer tutucu gönderilir.
      identityNumber: '11111111111',
      registrationAddress: buyer.address,
      ip,
      city: buyer.city,
      country: 'Turkey',
    },
    shippingAddress: address,
    billingAddress: address,
    basketItems: cart.lines.map((l) => ({
      id: lineItemId(l),
      name: `${l.name} (${l.color}) x${l.quantity}`,
      category1: l.category,
      itemType: 'PHYSICAL',
      price: money(l.lineTotal),
    })),
  }).catch((err: unknown) => {
    console.error('[payment/initialize]', err);
    return null;
  });

  if (!result || result.status !== 'success' || !result.paymentPageUrl) {
    await updateOrder(orderId, { payment_status: 'failed' }).catch(() => null);
    return json(502, { error: 'gateway_error', message: result?.errorMessage });
  }

  console.info(
    '[payment/initialize]',
    JSON.stringify({ orderId, total: cart.total, source, lines: cart.lines.length }),
  );
  return json(200, { orderId, total: cart.total, paymentPageUrl: result.paymentPageUrl });
}
