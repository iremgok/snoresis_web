# Snoresis AI — Web

Snoresis AI için tek sayfalık tanıtım ve e-ticaret sitesi. Vite + React 19 + TypeScript + Tailwind CSS v4.

```bash
npm install
npm run dev       # geliştirme sunucusu
npm run build     # tip kontrolü + üretim derlemesi (dist/)
npm run lint      # oxlint
```

## Yapı

```
src/
  data/site.ts          İletişim, WhatsApp, mağaza bağlantıları ve menü — yayın öncesi güncelleyin
  data/products.ts      Ürünler, fiyatlar ve renk seçenekleri
  context/              Sepet durumu (localStorage'da saklanır)
  components/sections/  Hero, Hakkımızda, Ürünler, Özellikler, Uygulama, İletişim
  components/cart/      Sepet paneli ve ödeme akışı
  components/ui/        Logo, ürün çizimleri (SVG), mağaza rozetleri, modal
```

## Yayın öncesi yapılacaklar

- `src/data/site.ts` içindeki dahili telefon (`+90 232 XXX XX XX`), WhatsApp numarası (`905xxxxxxxxx`) ve App Store / Google Play bağlantılarını gerçek değerlerle değiştirin.
- İletişim formu (`ContactSection.tsx`) şu an gönderimi simüle eder; mesajların ulaşması için bir API veya form servisine (ör. Formspree, kendi backend'iniz) bağlayın.
- `src/components/ui/PolicyModal.tsx` içindeki KVKK ve gizlilik metinleri yer tutucudur; hukuki onaylı metinlerle değiştirin.
- Ödeme iyzico Checkout Form + 3D Secure ile çalışır (`api/payment/*`, Vercel Functions). Kart bilgileri iyzico'nun sayfasında alınır, sunucumuzdan geçmez. Tutar her zaman `api/_lib/catalog.ts`'teki fiyatlarla sunucuda hesaplanır — fiyat değişince bu dosyayı, `src/data/products.ts`'i ve mobil uygulamanın kataloğunu birlikte güncelleyin.
- Vercel ortam değişkenleri:
  - `IYZICO_API_KEY`, `IYZICO_SECRET_KEY`, `IYZICO_BASE_URL` (test: `https://sandbox-api.iyzipay.com`, canlı: `https://api.iyzipay.com`)
  - `PUBLIC_SITE_URL` (ör. `https://snoresis-web.vercel.app`; iyzico dönüş adresi buradan üretilir)
  - `SUPABASE_URL`, `SUPABASE_ANON_KEY` (mobil uygulamanın Supabase projesi; `/hesap-silme` için)
  - `SUPABASE_SERVICE_ROLE_KEY` (yalnızca sunucu; `orders` tablosu — asla `VITE_` önekiyle tanımlamayın)
- Siparişler Supabase `orders` tablosunda tutulur: `supabase/migrations/20261014_create_orders.sql` dosyasını mobil uygulamanın Supabase projesine uygulayın (SQL Editor veya `snoresis_app/supabase/migrations` + `supabase db push`). Ödeme başlarken sipariş `pending` yazılır, iyzico dönüşünde `paid` olur; Sipariş Takip yalnızca ödenmiş siparişleri gösterir. Kargoya verirken `status`, `carrier`, `tracking_number` (boşluksuz, büyük harf), `location` ve `events` alanlarını güncelleyin.
- `/api/*` uçları `npm run dev` ile çalışmaz; yerelde `vercel dev` kullanın.

## Sayfalar

- `/gizlilik` — Gizlilik Politikası, KVKK ve Health Connect beyanı (Play Console ve Health Connect izin gerekçesi bu adresi kullanır)
- `/hesap-silme` — e-posta kodu ile hesap ve veri silme (mobil uygulamanın `delete-account` Edge Function'ını çağırır)
- `/odeme?items=ürünId:renk:adet,...&source=app` — uygulama içi WebView ödeme sayfası; sonuç `/odeme/basarili` veya `/odeme/basarisiz`
