// POST /api/orders/cancel   { id, email, reason, note? }
// → 200 TrackedOrder  |  400  |  404  |  409 (kargoya verilmiş)  |  503
//
// Kargoya verilmemiş siparişi iptal eder ve ödemeyi iyzico üzerinden iade etmeyi dener. iyzico
// "cancel" yalnızca gün sonu mutabakatından önce çalışır; sonrasında iade elle yapılır
// (`refund_status = 'manual_required'`, günlükte uyarı).

import { clientIp, json, readJson } from '../_lib/http.js';
import { cancelPayment } from '../_lib/iyzico.js';
import {
  findPaidOrder,
  isEmail,
  normalizeEmail,
  normalizeNumber,
  ordersConfigured,
  toTrackedOrder,
  updateOrder,
} from '../_lib/orders.js';

const REASONS = ['changed-mind', 'wrong-product', 'slow-delivery', 'other'];

export async function POST(req: Request) {
  if (!ordersConfigured()) return json(503, { error: 'orders_unavailable' });
  const body = await readJson<{ id?: unknown; email?: unknown; reason?: unknown; note?: unknown }>(req);
  const id = normalizeNumber(body?.id);
  const email = normalizeEmail(body?.email);
  const reason = typeof body?.reason === 'string' && REASONS.includes(body.reason) ? body.reason : null;
  const note = typeof body?.note === 'string' ? body.note.trim().slice(0, 500) || undefined : undefined;
  if (!/^SNR-[A-Z0-9-]{4,30}$/.test(id) || !isEmail(email) || !reason) {
    return json(400, { error: 'invalid_request' });
  }

  try {
    const order = await findPaidOrder(id, email);
    if (!order || order.id !== id) return json(404, { error: 'not_found' });
    if (order.status !== 'preparing') return json(409, { error: 'not_cancellable' });

    // Önce sipariş iptal edilir (koşullu: bu arada kargoya verildiyse eşleşmez), sonra iade denenir.
    const at = new Date().toISOString();
    const cancelled = await updateOrder(
      order.id,
      {
        status: 'cancelled',
        cancellation: { reason, note, at },
        refund_status: 'manual_required',
        events: [{ at, label: 'Sipariş iptal edildi', location: 'Müşteri talebi' }, ...order.events],
      },
      { status: 'preparing' },
    );
    if (!cancelled) return json(409, { error: 'not_cancellable' });

    const refund = order.payment_id
      ? await cancelPayment(order.payment_id, clientIp(req), order.id).catch(() => null)
      : null;
    if (refund?.status === 'success') {
      await updateOrder(order.id, { refund_status: 'refunded' }).catch(() => null);
    } else {
      console.error(
        '[orders/cancel] OTOMATİK İADE YAPILAMADI — iyzico panelinden iade edin',
        order.id,
        order.payment_id,
      );
    }
    return json(200, toTrackedOrder(cancelled));
  } catch (err) {
    console.error('[orders/cancel]', err);
    return json(503, { error: 'orders_unavailable' });
  }
}
