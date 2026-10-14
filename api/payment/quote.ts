// GET /api/payment/quote?items=smart_wristband:black:1,charger:Beyaz:2
// → 200 { lines: PricedLine[], total }  |  400 { error }
//
// Ödeme sayfası özetini sunucudaki fiyatlarla gösterir; ödeme başlatılırken tutar yeniden hesaplanır.

import { CartError, priceCart } from '../_lib/catalog.js';
import { json } from '../_lib/http.js';

export function GET(req: Request) {
  const items = new URL(req.url).searchParams.get('items') ?? '';
  try {
    return json(200, priceCart(items));
  } catch (err) {
    if (err instanceof CartError) return json(400, { error: 'invalid_cart', message: err.message });
    throw err;
  }
}
