export interface ColorOption {
  name: string;
  hex: string;
}

export type ProductArt = 'ring' | 'dock' | 'case';

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  highlights: string[];
  price: number;
  art: ProductArt;
  colors: ColorOption[];
  featured?: boolean;
  rating: Rating;
}

export interface CartItem {
  key: string;
  product: Product;
  color: ColorOption;
  quantity: number;
}

export interface Rating {
  /** 0–5 arası ortalama puan */
  average: number;
  count: number;
}

export interface Review {
  id: string;
  author: string;
  city: string;
  productId: Product['id'];
  rating: 1 | 2 | 3 | 4 | 5;
  body: string;
  /** ISO tarih (YYYY-MM-DD) */
  date: string;
  verified: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string[];
}

export type PolicyKey = 'kvkk' | 'terms' | 'distance-sales' | 'pre-info' | 'cookies' | 'returns';

export type PolicyBlock = { heading?: string; paragraphs?: string[]; list?: string[] };

export interface Policy {
  title: string;
  /** Son güncelleme tarihi, ISO (YYYY-MM-DD) */
  updated: string;
  blocks: PolicyBlock[];
}

export type CookieCategory = 'necessary' | 'analytics' | 'marketing';

export type CookieConsent = Record<CookieCategory, boolean> & { decidedAt: string };

export type OrderStatus = 'preparing' | 'shipped' | 'delivered' | 'cancelled';

export type CancelReason = 'changed-mind' | 'wrong-product' | 'slow-delivery' | 'other';

export interface OrderLine {
  name: string;
  color: string;
  quantity: number;
  price: number;
}

export interface OrderEvent {
  /** ISO tarih-saat */
  at: string;
  label: string;
  location: string;
}

export interface TrackedOrder {
  id: string;
  email: string;
  createdAt: string;
  status: OrderStatus;
  /** Kargo firmasının takip numarası; kargoya verilince oluşur */
  trackingNumber?: string;
  carrier?: string;
  location: string;
  /** ISO tarih (YYYY-MM-DD) */
  estimatedDelivery: string;
  items: OrderLine[];
  total: number;
  /** Yeniden eskiye */
  events: OrderEvent[];
  cancellation?: { reason: CancelReason; note?: string; at: string };
}
