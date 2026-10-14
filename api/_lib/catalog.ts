// Sunucu tarafı ürün kataloğu ve fiyat hesabı — ödeme tutarının TEK doğruluk kaynağı.
//
// İstemci (web sepeti veya mobil uygulamanın WebView'i) yalnızca `ürünId:renk:adet` gönderir;
// birim fiyat, satır tutarı ve toplam her zaman burada yeniden hesaplanır. İstemcinin
// gönderdiği hiçbir fiyat alanı okunmaz. Fiyat değiştiğinde burayı, `src/data/products.ts`'i
// ve mobil uygulamanın `StaticProductRepository`'sini birlikte güncelleyin.

export interface CatalogProduct {
  name: string;
  /** TL, KDV dahil birim fiyat */
  price: number;
  category: string;
}

// Kimlikler mobil uygulamanın `StaticProductRepository` kataloğuyla birebir aynıdır.
const PRODUCTS: Record<string, CatalogProduct> = {
  smart_wristband: { name: 'Snoresis Akıllı Bileklik', price: 6999, category: 'Akıllı Cihaz' },
  finger_clip_pro: { name: 'Parmak Klipsi Pro', price: 649, category: 'Akıllı Cihaz' },
  charger: { name: 'Şarj Aleti', price: 499, category: 'Aksesuar' },
  accessory_case: { name: 'Aksesuar Kılıfı', price: 250, category: 'Aksesuar' },
};

// Eski web sepeti kimlikleri (önceden kaydedilmiş bağlantılar / sepetler için)
const ALIASES: Record<string, string> = { dock: 'charger', case: 'accessory_case' };

// Web sepeti Türkçe adı, uygulama Dart enum adını (`ProductColor.name`) gönderir.
const COLORS: Record<string, string> = {
  black: 'Siyah',
  white: 'Beyaz',
  gray: 'Gri',
  gold: 'Gold',
  pink: 'Pembe',
  blue: 'Mavi',
};
const COLOR_BY_LABEL = new Map(Object.entries(COLORS).map(([key, label]) => [label.toLocaleLowerCase('tr'), key]));

export const MAX_QUANTITY = 10;
const MAX_LINES = 20;

export interface PricedLine {
  productId: string;
  colorKey: string;
  name: string;
  color: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  category: string;
}

export class CartError extends Error {}

const resolveColor = (raw: string) => {
  const v = raw.trim();
  if (COLORS[v.toLowerCase()]) return v.toLowerCase();
  return COLOR_BY_LABEL.get(v.toLocaleLowerCase('tr')) ?? null;
};

/** Tek satırı katalogdan fiyatlar; geçersiz ürün/renk/adet → CartError. */
export const priceLine = (rawId: string, rawColor: string, quantity: number): PricedLine => {
  const productId = ALIASES[rawId] ?? rawId;
  const product = PRODUCTS[productId];
  if (!product) throw new CartError(`Bilinmeyen ürün: ${rawId}`);
  const colorKey = resolveColor(rawColor);
  if (!colorKey) throw new CartError(`Bilinmeyen renk: ${rawColor}`);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
    throw new CartError(`Geçersiz adet: ${quantity}`);
  }
  return {
    productId,
    colorKey,
    name: product.name,
    color: COLORS[colorKey],
    quantity,
    unitPrice: product.price,
    lineTotal: product.price * quantity,
    category: product.category,
  };
};

/**
 * `smart_wristband:black:1,charger:Beyaz:2` biçimindeki sepeti fiyatlar.
 * Aynı ürün+renk birden fazla geçerse adetler birleştirilir.
 */
export const priceCart = (items: string) => {
  const parts = items
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);
  if (!parts.length) throw new CartError('Sepet boş');
  if (parts.length > MAX_LINES) throw new CartError('Sepette çok fazla satır var');

  const merged = new Map<string, PricedLine>();
  for (const part of parts) {
    const [id = '', color = '', qty = ''] = part.split(':');
    if (!/^\d{1,2}$/.test(qty)) throw new CartError(`Geçersiz adet: ${qty}`);
    const line = priceLine(id.trim(), color, Number(qty));
    const key = `${line.productId}:${line.colorKey}`;
    const prev = merged.get(key);
    merged.set(key, prev ? priceLine(line.productId, line.colorKey, prev.quantity + line.quantity) : line);
  }
  const lines = [...merged.values()];
  return { lines, total: lines.reduce((n, l) => n + l.lineTotal, 0) };
};

/** iyzico sepet kalemi kimliği; geri dönüşte tutarı yeniden doğrulamak için satırı kodlar. */
export const lineItemId = (l: Pick<PricedLine, 'productId' | 'colorKey' | 'quantity'>) =>
  `${l.productId}:${l.colorKey}:${l.quantity}`;
