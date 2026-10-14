// POST /api/payment/callback?source=web|app   (iyzico, 3D Secure sonrası `token` ile çağırır)
// → 303 /odeme/basarili?order=…  |  303 /odeme/basarisiz?reason=…
//
// Tarayıcıdan gelen hiçbir alana güvenilmez: ödeme `token` ile iyzico'dan yeniden sorgulanır ve
// tahsil edilen tutar, sepet kalemlerinden sunucu kataloğuyla yeniden hesaplanan tutarla
// karşılaştırılır. Uyuşmazlıkta ödeme iptal edilir (iade). Mobil uygulama, bu yönlendirmelerin
// hedefini (/odeme/basarili, /odeme/basarisiz) yakalayarak WebView'i kapatır.
//
// Başarılı ödemede /api/payment/initialize'ın yazdığı bekleyen sipariş `paid` yapılır ve
// "Sipariş Takip"te görünür hâle gelir. iyzico aynı token ile birden fazla dönebilir; ikinci
// dönüş siparişi değiştirmez.

import { CartError, priceLine } from '../_lib/catalog.js';
import { clientIp, redirect, siteUrl } from '../_lib/http.js';
import { cancelPayment, retrieveCheckoutForm, type CheckoutFormResult } from '../_lib/iyzico.js';
import { businessDaysFrom, getOrder, updateOrder, WAREHOUSE, type OrderRow } from '../_lib/orders.js';

const readToken = async (req: Request) => {
  const fromQuery = new URL(req.url).searchParams.get('token');
  if (fromQuery) return fromQuery;
  try {
    const form = await req.formData();
    const token = form.get('token');
    return typeof token === 'string' ? token : null;
  } catch {
    return null;
  }
};

/** Sepet kalemlerinden beklenen tutarı yeniden hesaplar; tutmazsa null. */
const expectedTotal = (r: CheckoutFormResult) => {
  try {
    let sum = 0;
    for (const t of r.itemTransactions ?? []) {
      const [id = '', color = '', qty = ''] = t.itemId.split(':');
      const line = priceLine(id, color, Number(qty));
      if (Math.abs(line.lineTotal - Number(t.price)) > 0.001) return null;
      sum += line.lineTotal;
    }
    return sum > 0 ? sum : null;
  } catch (err) {
    if (err instanceof CartError) return null;
    throw err;
  }
};

const sameAmount = (a: number, b: number) => Math.abs(a - b) < 0.001;

const loadOrder = (id: string | undefined) =>
  id
    ? getOrder(id).catch((err: unknown) => {
        console.error('[payment/callback] sipariş okunamadı', id, err);
        return null;
      })
    : Promise.resolve(null);

const markFailed = (order: OrderRow | null, patch: Partial<OrderRow> = {}) =>
  order?.payment_status === 'pending'
    ? updateOrder(order.id, { payment_status: 'failed', ...patch }, { payment_status: 'pending' }).catch(() => null)
    : null;

const handle = async (req: Request) => {
  const url = new URL(req.url);
  const source = url.searchParams.get('source') === 'app' ? 'app' : 'web';
  const base = siteUrl(req);
  const fail = (reason: string) => redirect(`${base}/odeme/basarisiz?reason=${reason}&source=${source}`);

  const token = await readToken(req);
  if (!token) return fail('missing_token');

  const result = await retrieveCheckoutForm(token).catch((err: unknown) => {
    console.error('[payment/callback] sorgu başarısız', err);
    return null;
  });
  if (!result || result.status !== 'success') return fail('gateway_error');

  const order = await loadOrder(result.basketId);
  if (result.paymentStatus !== 'SUCCESS' || result.fraudStatus === 0) {
    await markFailed(order);
    return fail('declined');
  }

  // Tutar iki kez doğrulanır: sepet kalemleri sunucu kataloğuyla ve kayıtlı siparişin toplamıyla.
  const expected = expectedTotal(result);
  const paid = Number(result.price);
  const mismatch =
    expected === null ||
    result.currency !== 'TRY' ||
    !sameAmount(expected, paid) ||
    (order !== null && !sameAmount(Number(order.total), paid));
  if (mismatch) {
    console.error(
      '[payment/callback] TUTAR UYUŞMAZLIĞI',
      JSON.stringify({ basketId: result.basketId, expected, paid, stored: order?.total }),
    );
    let refunded = false;
    if (result.paymentId) {
      const cancel = await cancelPayment(result.paymentId, clientIp(req), result.conversationId).catch(() => null);
      refunded = cancel?.status === 'success';
      if (!refunded) {
        console.error('[payment/callback] otomatik iptal başarısız — iyzico panelinden iade edin', result.paymentId);
      }
    }
    await markFailed(order, {
      payment_id: result.paymentId ?? null,
      refund_status: refunded ? 'refunded' : 'manual_required',
    });
    return fail('amount_mismatch');
  }

  const success = () => {
    const params = new URLSearchParams({ order: result.basketId ?? '', total: String(paid), source });
    return redirect(`${base}/odeme/basarili?${params}`);
  };

  // Para çekildi: veritabanı yazılamasa bile kullanıcıya başarı gösterilir, sipariş
  // günlükten ve iyzico panelinden (basketId / paymentId) elle tamamlanır.
  if (!order) {
    console.error('[payment/callback] KAYITSIZ ÖDEME — siparişi elle oluşturun', result.basketId, result.paymentId);
    return success();
  }
  if (order.payment_status === 'paid' && order.payment_id === result.paymentId) return success();

  const now = new Date();
  const updated = await updateOrder(
    order.id,
    {
      payment_status: 'paid',
      payment_id: result.paymentId ?? null,
      paid_at: now.toISOString(),
      estimated_delivery: businessDaysFrom(now, 3),
      events: [{ at: now.toISOString(), label: 'Sipariş alındı, hazırlanıyor', location: WAREHOUSE }],
    },
    { payment_status: order.payment_status },
  ).catch((err: unknown) => {
    console.error('[payment/callback] SİPARİŞ GÜNCELLENEMEDİ — elle "paid" yapın', order.id, result.paymentId, err);
    return null;
  });
  console.info(
    '[payment/callback] ödeme alındı',
    JSON.stringify({ orderId: order.id, paymentId: result.paymentId, total: paid, source, saved: !!updated }),
  );
  return success();
};

export const POST = handle;
export const GET = handle;
