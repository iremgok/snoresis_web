import { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Snoresis Pro Cihazı',
    description: 'Gelişmiş sensörler ve AI destekli horlama ve apne önleme cihazı',
    price: 6999,
    imageIcon: '📱',
    colors: [
      { name: 'Gümüş', hex: '#E2E8F0' },
      { name: 'Pembe', hex: '#EC4899' },
      { name: 'Mavi', hex: '#3B82F6' },
      { name: 'Siyah', hex: '#000000' },
      { name: 'Yeşil', hex: '#10B981' }
    ]
  },
  {
    id: '2',
    name: 'Akıllı Uyku Bandı',
    description: 'Uyku kalitenizi anlık takip eden konforlu akıllı bant',
    price: 499,
    imageIcon: '⌚',
    colors: [
      { name: 'Lacivert', hex: '#1E3A8A' },
      { name: 'Kırmızı', hex: '#EF4444' },
      { name: 'Yeşil', hex: '#10B981' },
      { name: 'Siyah', hex: '#000000' }
    ]
  },
  {
    id: '3',
    name: 'Şarj Aleti & Aksesuar',
    description: 'Hızlı şarj doku ve silikon koruma kılıfı paketi',
    price: 250,
    imageIcon: '🎁'
  }
];
