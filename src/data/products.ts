import type { ColorOption, Product } from '../types';

export const COLORS: ColorOption[] = [
  { name: 'Siyah', hex: '#1C1D21' },
  { name: 'Beyaz', hex: '#F3F2EE' },
  { name: 'Gri', hex: '#9AA0AA' },
  { name: 'Gold', hex: '#C9A25E' },
  { name: 'Pembe', hex: '#E8A7B6' },
  { name: 'Mavi', hex: '#3D7BEA' },
];

// Ürün kimlikleri, adlar ve fiyatlar mobil uygulamanın kataloğuyla (StaticProductRepository) ve
// sunucu kataloğuyla (api/_lib/catalog.ts) birebir aynıdır; birini değiştirirken diğerlerini de güncelleyin.
// Puanlar ve yorum sayıları örnektir; mağaza yorum sisteminizden gelen gerçek değerlerle değiştirin.
export const PRODUCTS: Product[] = [
  {
    id: 'smart_wristband',
    name: 'Snoresis Akıllı Bileklik',
    tagline: 'Gece SpO₂ & Nabız İzleme',
    description:
      'Gece boyunca bileğinizde, fark etmeyeceğiniz kadar hafif. Kandaki oksijen, nabız ve nefes duraksamalarını kesintisiz ölçer.',
    highlights: ['SpO2 ölçümü', 'Nabız takibi', 'Apne tespiti', 'Bluetooth BLE'],
    price: 6999,
    art: 'wristband',
    badge: 'Çok Satan',
    rating: { average: 4.8, count: 312 },
    colors: COLORS,
    featured: true,
  },
  {
    id: 'finger_clip_pro',
    name: 'Parmak Klipsi Pro',
    tagline: 'Kablosuz Oksimetre',
    description:
      'Parmak ucundan SpO₂ ve nabız ölçen kablosuz oksimetre. Bileklikle birlikte ya da tek başına kullanılabilir.',
    highlights: ['Parmak ucu SpO₂', 'Kablosuz', 'Bileklikle uyumlu'],
    price: 649,
    oldPrice: 899,
    art: 'clip',
    badge: 'Yeni',
    rating: { average: 4.7, count: 64 },
    colors: COLORS,
  },
  {
    id: 'charger',
    name: 'Şarj Aleti',
    tagline: 'Snoresis Cihazları İçin Şarj Ünitesi',
    description: 'Cihazınızı bırakın, mıknatıs gerisini halletsin. Komodininize yakışan sade bir şarj ünitesi.',
    highlights: ['Manyetik hizalama', 'Komodin dostu'],
    price: 499,
    art: 'dock',
    rating: { average: 4.9, count: 148 },
    colors: COLORS,
  },
  {
    id: 'accessory_case',
    name: 'Aksesuar Kılıfı',
    tagline: 'Koruyucu Taşıma Kılıfı',
    description: 'Bilekliğiniz ve şarj aletiniz için koruyucu taşıma kılıfı.',
    highlights: ['Bileklik + şarj aleti', 'Seyahate uygun'],
    price: 250,
    art: 'case',
    rating: { average: 4.7, count: 96 },
    colors: COLORS,
  },
];

/** Eski web sepetlerindeki kimlikler (localStorage) → güncel katalog */
export const LEGACY_PRODUCT_IDS: Record<string, string> = { dock: 'charger', case: 'accessory_case' };
