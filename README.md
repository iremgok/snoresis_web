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
- Ödeme akışı bir simülasyondur; kart bilgileri hiçbir yere gönderilmez. Canlı satış için bir ödeme altyapısı (ör. iyzico, PayTR) entegre edilmelidir.
