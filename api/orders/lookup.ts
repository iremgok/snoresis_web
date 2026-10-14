// POST /api/orders/lookup   { number, email }
// → 200 TrackedOrder  |  400  |  404 (eşleşme yok)  |  503
//
// Web'deki ve uygulamadan açılan "Sipariş Takip" ekranı. Sipariş no veya kargo takip no ile
// e-posta birlikte eşleşmeden hiçbir bilgi dönmez; yalnızca ödemesi tamamlanmış siparişler bulunur.

import { json, readJson } from '../_lib/http.js';
import {
  findPaidOrder,
  isEmail,
  normalizeEmail,
  normalizeNumber,
  ordersConfigured,
  toTrackedOrder,
} from '../_lib/orders.js';

export async function POST(req: Request) {
  if (!ordersConfigured()) return json(503, { error: 'orders_unavailable' });
  const body = await readJson<{ number?: unknown; email?: unknown }>(req);
  const number = normalizeNumber(body?.number);
  const email = normalizeEmail(body?.email);
  if (!/^[A-Z0-9-]{4,40}$/.test(number) || !isEmail(email)) {
    return json(400, { error: 'invalid_request' });
  }
  try {
    const order = await findPaidOrder(number, email);
    return order ? json(200, toTrackedOrder(order)) : json(404, { error: 'not_found' });
  } catch (err) {
    console.error('[orders/lookup]', err);
    return json(503, { error: 'orders_unavailable' });
  }
}
