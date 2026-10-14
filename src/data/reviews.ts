import type { Review } from '../types';

// ÖRNEK yorumlar — tasarım içindir. Yayına almadan önce gerçek ve doğrulanmış müşteri yorumlarıyla
// değiştirin; gerçek olmayan yorumların yayımlanması 6502 sayılı Kanun ve Ticari Reklam Yönetmeliği'ne aykırıdır.
export const REVIEWS: Review[] = [
  {
    id: 'r1',
    author: 'Elif K.',
    city: 'İzmir',
    productId: 'smart_wristband',
    rating: 5,
    body: 'Eşim horladığımı söylüyordu, ben inanmıyordum. İlk haftanın raporunu doktora götürdüm. Bilekliği taktığımı artık fark etmiyorum.',
    date: '2026-08-14',
    verified: true,
  },
  {
    id: 'r2',
    author: 'Murat D.',
    city: 'Ankara',
    productId: 'smart_wristband',
    rating: 5,
    body: 'Saatle uyuyamıyordum, bileklik çok daha hafif. Yastık değiştirdim, iki haftada gece uyanmalarım belirgin azaldı.',
    date: '2026-07-29',
    verified: true,
  },
  {
    id: 'r3',
    author: 'Zeynep A.',
    city: 'İstanbul',
    productId: 'charger',
    rating: 4,
    body: 'Mıknatıs bilekliği karanlıkta bile yerine oturtuyor. Kablosu biraz daha uzun olabilirdi.',
    date: '2026-09-03',
    verified: true,
  },
];
