import type { ColorOption, Product } from '../types';

export const COLORS: ColorOption[] = [
  { name: 'Siyah', hex: '#1C1D21' },
  { name: 'Beyaz', hex: '#F3F2EE' },
  { name: 'Gri', hex: '#9AA0AA' },
  { name: 'Gold', hex: '#C9A25E' },
  { name: 'Pembe', hex: '#E8A7B6' },
  { name: 'Mavi', hex: '#3D7BEA' },
];

// Puanlar ve yorum sayıları örnektir; mağaza yorum sisteminizden gelen gerçek değerlerle değiştirin.
export const PRODUCTS: Product[] = [
  {
    id: 'ring',
    name: 'Snoresis Akıllı Yüzük',
    tagline: 'SpO2 · Nabız · Apne Takibi',
    description:
      'Gece boyunca parmağınızda, fark etmeyeceğiniz kadar hafif. Kandaki oksijen, nabız ve nefes duraksamalarını kesintisiz ölçer.',
    highlights: ['SpO2 ölçümü', 'Nabız takibi', 'Apne tespiti', 'Bluetooth BLE'],
    price: 6999,
    art: 'ring',
    rating: { average: 4.8, count: 312 },
    colors: COLORS,
    featured: true,
  },
  {
    id: 'dock',
    name: 'Şarj Aleti',
    tagline: 'Manyetik Şarj Ünitesi',
    description: 'Yüzüğü bırakın, mıknatıs gerisini halletsin. Komodininize yakışan sade bir şarj ünitesi.',
    highlights: ['Manyetik hizalama', 'Komodin dostu'],
    price: 499,
    art: 'dock',
    rating: { average: 4.9, count: 148 },
    colors: COLORS,
  },
  {
    id: 'case',
    name: 'Aksesuar Kılıfı',
    tagline: 'Koruyucu Seyahat Kılıfı',
    description: 'Yüzüğünüz ve şarj aletiniz için koruyucu taşıma kılıfı.',
    highlights: ['Yüzük + şarj aleti', 'Seyahate uygun'],
    price: 250,
    art: 'case',
    rating: { average: 4.7, count: 96 },
    colors: COLORS,
  },
];
