// Supabase `orders` tablosu (supabase/migrations/20261014_create_orders.sql) — yalnızca sunucuda.
//
// Ortam: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY. Service role anahtarı RLS'yi aşar; asla
// istemciye (VITE_* değişkenlerine) konulmaz. Bağımlılık eklememek için PostgREST'e fetch ile
// erişilir.

export type PaymentStatus = 'pending' | 'paid' | 'failed';
export type OrderStatus = 'preparing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderLine {
  productId: string;
  name: string;
  color: string;
  quantity: number;
  price: number;
}

export interface OrderEvent {
  at: string;
  label: string;
  location: string;
}

export interface OrderRow {
  id: string;
  email: string;
  source: 'web' | 'app';
  payment_status: PaymentStatus;
  payment_id: string | null;
  paid_at: string | null;
  refund_status: 'refunded' | 'manual_required' | null;
  status: OrderStatus;
  items: OrderLine[];
  total: number | string;
  currency: string;
  shipping: { firstName: string; lastName: string; phone: string; city: string; address: string };
  carrier: string | null;
  tracking_number: string | null;
  location: string;
  estimated_delivery: string | null;
  events: OrderEvent[];
  cancellation: { reason: string; note?: string; at: string } | null;
  created_at: string;
}

export const WAREHOUSE = 'Snoresis Depo · İzmir';

const config = () => {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url, key } : null;
};

export const ordersConfigured = () => config() !== null;

const rest = async <T>(method: string, query: string, body?: unknown, prefer = 'return=representation') => {
  const cfg = config();
  if (!cfg) throw new Error('[orders] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY tanımlı değil');
  const res = await fetch(`${cfg.url}/rest/v1/orders?${query}`, {
    method,
    headers: {
      apikey: cfg.key,
      Authorization: `Bearer ${cfg.key}`,
      'Content-Type': 'application/json',
      Prefer: prefer,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`[orders] ${method} ${res.status} ${await res.text().catch(() => '')}`);
  // return=minimal yanıtları (201/204) gövdesizdir.
  const text = await res.text();
  return (text ? JSON.parse(text) : []) as T;
};

const eq = (v: string) => `eq.${v}`;

/** Sipariş / kargo no: boşluksuz, büyük harf (kargo takip numaraları da bu biçimde saklanmalıdır). */
export const normalizeNumber = (v: unknown) =>
  typeof v === 'string' ? v.trim().toUpperCase().replace(/\s+/g, '') : '';
export const normalizeEmail = (v: unknown) => (typeof v === 'string' ? v.trim().toLowerCase() : '');
// PostgREST filtresine girdiği için virgül ve parantez kabul edilmez.
export const isEmail = (v: string) => v.length <= 120 && /^[^\s@,()]+@[^\s@,()]+\.[^\s@,()]+$/.test(v);

export const insertOrder = (
  row: Pick<OrderRow, 'id' | 'email' | 'source' | 'items' | 'shipping'> & { total: number },
) => rest<OrderRow[]>('POST', '', row, 'return=minimal');

export const getOrder = async (id: string) =>
  (await rest<OrderRow[]>('GET', new URLSearchParams({ id: eq(id), select: '*' }).toString()))[0] ?? null;

/** Koşullu güncelleme: `where` eşleşmezse (ör. durum değişmişse) null döner. */
export const updateOrder = async (id: string, patch: Partial<OrderRow>, where: Record<string, string> = {}) => {
  const q = new URLSearchParams({ id: eq(id) });
  for (const [k, v] of Object.entries(where)) q.set(k, eq(v));
  return (await rest<OrderRow[]>('PATCH', q.toString(), patch))[0] ?? null;
};

/** Sipariş no veya kargo takip no + e-posta ile ödenmiş siparişi bulur. */
export const findPaidOrder = async (number: string, email: string) => {
  const q = new URLSearchParams({
    or: `(id.eq.${number},tracking_number.eq.${number})`,
    email: eq(email),
    payment_status: eq('paid'),
    select: '*',
    limit: '1',
  });
  return (await rest<OrderRow[]>('GET', q.toString()))[0] ?? null;
};

/** Hafta sonlarını atlayarak iş günü ekler; YYYY-MM-DD döner. */
export const businessDaysFrom = (from: Date, days: number) => {
  const d = new Date(from);
  let left = days;
  while (left > 0) {
    d.setUTCDate(d.getUTCDate() + 1);
    if (d.getUTCDay() !== 0 && d.getUTCDay() !== 6) left--;
  }
  return d.toISOString().slice(0, 10);
};

/** Veritabanı satırı → web "Sipariş Takip" ekranının beklediği biçim (src/types.ts TrackedOrder). */
export const toTrackedOrder = (o: OrderRow) => ({
  id: o.id,
  email: o.email,
  createdAt: o.paid_at ?? o.created_at,
  status: o.status,
  trackingNumber: o.tracking_number ?? undefined,
  carrier: o.carrier ?? undefined,
  location: o.location,
  estimatedDelivery: o.estimated_delivery ?? businessDaysFrom(new Date(o.created_at), 3),
  items: o.items.map(({ name, color, quantity, price }) => ({ name, color, quantity, price })),
  total: Number(o.total),
  events: o.events,
  cancellation: o.cancellation ?? undefined,
});
