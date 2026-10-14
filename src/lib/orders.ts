import { DEMO_ORDERS } from '../data/orders';
import type { CancelReason, CartItem, TrackedOrder } from '../types';
import { ApiError, FriendlyError, postJson } from './errors';

// Sipariş sorgulama ve iptal. Üretimde siparişler Supabase'deki `orders` tablosundan /api/orders
// üzerinden okunur (web ve mobil uygulama siparişleri birlikte). Geliştirme ortamında (`npm run dev`,
// API yok) siparişler bu tarayıcıda saklanır ve örnek siparişler eklenir; VITE_ORDERS_ENDPOINT
// tanımlanarak geliştirmede de API kullanılabilir (ör. `vercel dev` ile `/api/orders`).
const ENDPOINT =
  (import.meta.env.VITE_ORDERS_ENDPOINT as string | undefined) ?? (import.meta.env.PROD ? '/api/orders' : undefined);
const STORAGE_KEY = 'snoresis-orders-v1';

export const CANCEL_REASONS: { value: CancelReason; label: string }[] = [
  { value: 'changed-mind', label: 'Sipariş Vazgeçtim' },
  { value: 'wrong-product', label: 'Yanlış Ürün Seçimi' },
  { value: 'slow-delivery', label: 'Teslimat Süresi Uzun' },
  { value: 'other', label: 'Diğer' },
];

const NOT_FOUND = new FriendlyError(
  'Bu numara ve e-posta ile eşleşen bir sipariş bulamadık. Sipariş onay e-postanızdaki numarayı ve siparişte kullandığınız e-posta adresini kontrol ediniz.',
  'Sipariş bulunamadı',
);

const NOT_CANCELLABLE = new FriendlyError(
  'Siparişiniz kargoya verildiği için artık iptal edilemiyor. Teslim aldıktan sonra 14 gün içinde ücretsiz iade edebilirsiniz.',
  'İptal edilemedi',
);

const readStored = (): TrackedOrder[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as TrackedOrder[];
  } catch {
    return [];
  }
};

const writeStored = (orders: TrackedOrder[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch {
    // Depolama kapalıysa sipariş yalnızca bu oturumda sorgulanamaz; ödeme akışı etkilenmez.
  }
};

const allOrders = () => [...readStored(), ...(import.meta.env.DEV ? DEMO_ORDERS : [])];

const normalize = (v: string) => v.trim().toUpperCase().replace(/\s+/g, '');
const sameEmail = (a: string, b: string) => a.trim().toLocaleLowerCase('tr') === b.trim().toLocaleLowerCase('tr');

const delay = (ms: number) => new Promise((r) => window.setTimeout(r, ms));

/** Sipariş veya kargo takip numarası + e-posta ile siparişi bulur. */
export const lookupOrder = async (number: string, email: string): Promise<TrackedOrder> => {
  if (ENDPOINT) {
    try {
      const res = await postJson(`${ENDPOINT}/lookup`, { number: normalize(number), email: email.trim() });
      return (await res.json()) as TrackedOrder;
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) throw NOT_FOUND;
      throw err;
    }
  }
  await delay(700);
  if (!navigator.onLine) throw new TypeError('Failed to fetch');
  const key = normalize(number);
  const order = allOrders().find(
    (o) =>
      (normalize(o.id) === key || (o.trackingNumber && normalize(o.trackingNumber) === key)) &&
      sameEmail(o.email, email),
  );
  if (!order) throw NOT_FOUND;
  return order;
};

/** Kargoya verilmemiş siparişi seçilen nedenle iptal eder. */
export const cancelOrder = async (order: TrackedOrder, reason: CancelReason, note?: string): Promise<TrackedOrder> => {
  if (order.status !== 'preparing') throw NOT_CANCELLABLE;
  if (ENDPOINT) {
    try {
      const res = await postJson(`${ENDPOINT}/cancel`, { id: order.id, email: order.email, reason, note });
      return (await res.json()) as TrackedOrder;
    } catch (err) {
      // Sayfa açıkken sipariş kargoya verilmiş olabilir.
      if (err instanceof ApiError && err.status === 409) throw NOT_CANCELLABLE;
      throw err;
    }
  }
  await delay(800);
  if (!navigator.onLine) throw new TypeError('Failed to fetch');
  const at = new Date().toISOString();
  const cancelled: TrackedOrder = {
    ...order,
    status: 'cancelled',
    cancellation: { reason, note: note?.trim() || undefined, at },
    events: [{ at, label: 'Sipariş iptal edildi', location: 'Müşteri talebi' }, ...order.events],
  };
  // Depodaki kayıt örnek siparişlerden önce arandığı için iptal edilmiş kopya geçerli olur.
  writeStored([cancelled, ...readStored().filter((o) => o.id !== order.id)]);
  return cancelled;
};

/** Hafta sonlarını atlayarak iş günü ekler. */
export const addBusinessDays = (from: Date, days: number) => {
  const d = new Date(from);
  let left = days;
  while (left > 0) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) left--;
  }
  return d;
};

const isoDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Ödeme tamamlandığında siparişi takip edilebilir hâle getirir. */
export const recordOrder = (id: string, email: string, items: CartItem[], total: number) => {
  const now = new Date();
  const order: TrackedOrder = {
    id,
    email: email.trim(),
    createdAt: now.toISOString(),
    status: 'preparing',
    location: 'Snoresis Depo · İzmir',
    estimatedDelivery: isoDate(addBusinessDays(now, 3)),
    items: items.map((i) => ({
      name: i.product.name,
      color: i.color.name,
      quantity: i.quantity,
      price: i.product.price,
    })),
    total,
    events: [{ at: now.toISOString(), label: 'Sipariş alındı, hazırlanıyor', location: 'Snoresis Depo · İzmir' }],
  };
  writeStored([order, ...readStored()]);
  return order;
};
