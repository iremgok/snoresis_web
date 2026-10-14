import type { CartItem } from '../types';
import { ApiError, FriendlyError, postJson } from './errors';

// iyzico ödeme akışının istemci tarafı. Tutarlar burada HESAPLANMAZ: sunucu (api/payment/*)
// sepeti kendi kataloğuyla fiyatlar; istemci yalnızca `ürünId:renk:adet` gönderir.

export interface Buyer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
}

export const EMPTY_BUYER: Buyer = { firstName: '', lastName: '', email: '', phone: '', city: '', address: '' };

export const BUYER_LABELS: Record<keyof Buyer, string> = {
  firstName: 'Ad',
  lastName: 'Soyad',
  email: 'E-posta',
  phone: 'Telefon',
  city: 'İl',
  address: 'Adres',
};

export type BuyerErrors = Partial<Record<keyof Buyer, string>>;

const digits = (v: string) => v.replace(/\D/g, '');

/** Sunucudaki doğrulamanın aynısı; kullanıcıya hızlı geri bildirim içindir. */
export const validateBuyer = (b: Buyer): BuyerErrors => {
  const e: BuyerErrors = {};
  if (b.firstName.trim().length < 2) e.firstName = 'Adınızı girin';
  if (b.lastName.trim().length < 2) e.lastName = 'Soyadınızı girin';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email.trim())) e.email = 'Geçerli bir e-posta girin';
  if (!/^5\d{9}$/.test(digits(b.phone).replace(/^0090|^90|^0/, ''))) e.phone = 'Geçerli bir cep telefonu girin (05xx)';
  if (b.city.trim().length < 2) e.city = 'İl girin';
  if (b.address.trim().length < 10) e.address = 'Teslimat adresini eksiksiz girin';
  return e;
};

export const formatPhone = (v: string) => v.replace(/[^\d+\s()]/g, '').slice(0, 18);

/** Web sepetini, mobil uygulamanın da kullandığı `ürünId:renk:adet` biçimine çevirir. */
export const cartToItems = (items: CartItem[]) =>
  items.map((i) => `${i.product.id}:${i.color.name}:${i.quantity}`).join(',');

export interface QuoteLine {
  productId: string;
  name: string;
  color: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Quote {
  lines: QuoteLine[];
  total: number;
}

const INVALID_CART = new FriendlyError(
  'Sepetinizdeki ürünlerden biri artık satışta değil ya da adedi geçersiz. Lütfen sepetinizi kontrol ediniz.',
  'Sepet doğrulanamadı',
);

export const fetchQuote = async (items: string): Promise<Quote> => {
  const res = await fetch(`/api/payment/quote?items=${encodeURIComponent(items)}`, {
    signal: AbortSignal.timeout(12_000),
  });
  if (res.status === 400) throw INVALID_CART;
  if (!res.ok) throw new ApiError(res.status);
  return (await res.json()) as Quote;
};

export interface PaymentStart {
  orderId: string;
  total: number;
  paymentPageUrl: string;
}

/** Ödemeyi sunucuda başlatır; dönen iyzico 3D Secure sayfasına yönlendirilmelidir. */
export const startPayment = async (items: string, buyer: Buyer, source: 'web' | 'app'): Promise<PaymentStart> => {
  try {
    const res = await postJson('/api/payment/initialize', { items, buyer, source });
    return (await res.json()) as PaymentStart;
  } catch (err) {
    if (err instanceof ApiError && err.status === 400) throw INVALID_CART;
    if (err instanceof ApiError && (err.status === 502 || err.status === 503)) {
      throw new FriendlyError(
        'Ödeme sağlayıcısına şu an ulaşılamıyor. Kartınızdan tutar çekilmedi; lütfen birkaç dakika sonra tekrar deneyiniz.',
        'Ödeme başlatılamadı',
      );
    }
    throw err;
  }
};

// Web'de iyzico sayfasına gidip dönen kullanıcının siparişini "Sipariş Takip"e eklemek için.
const PENDING_KEY = 'snoresis-pending-checkout-v1';

export interface PendingCheckout {
  orderId: string;
  email: string;
  items: CartItem[];
  total: number;
}

export const savePendingCheckout = (p: PendingCheckout) => {
  try {
    sessionStorage.setItem(PENDING_KEY, JSON.stringify(p));
  } catch {
    // Depolama kapalıysa sipariş yalnızca e-posta ile takip edilir.
  }
};

export const readPendingCheckout = (orderId: string): PendingCheckout | null => {
  try {
    const p = JSON.parse(sessionStorage.getItem(PENDING_KEY) ?? 'null') as PendingCheckout | null;
    return p?.orderId === orderId ? p : null;
  } catch {
    return null;
  }
};

export const clearPendingCheckout = () => {
  try {
    sessionStorage.removeItem(PENDING_KEY);
  } catch {
    // Depolama kapalı
  }
};
