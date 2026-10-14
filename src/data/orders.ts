import type { TrackedOrder } from '../types';

// Yalnızca geliştirme ortamında (npm run dev) sorgulanabilen örnek siparişler.
// E-posta: ornek@snoresis.com — SNR-2026-8942 (hazırlanıyor, iptal edilebilir), SNR-2026-7315 (kargoda), SNR-2026-6120 (teslim edildi)
const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();
const daysFromNow = (d: number) => new Date(Date.now() + d * 86_400_000).toISOString().slice(0, 10);

const WRISTBAND = { name: 'Snoresis Akıllı Bileklik', price: 6999 };

export const DEMO_EMAIL = 'ornek@snoresis.com';

export const DEMO_ORDERS: TrackedOrder[] = [
  {
    id: 'SNR-2026-8942',
    email: DEMO_EMAIL,
    createdAt: hoursAgo(3),
    status: 'preparing',
    location: 'Snoresis Depo · İzmir',
    estimatedDelivery: daysFromNow(3),
    items: [
      { ...WRISTBAND, color: 'Siyah', quantity: 1 },
      { name: 'Aksesuar Kılıfı', color: 'Gri', quantity: 1, price: 250 },
    ],
    total: 7249,
    events: [{ at: hoursAgo(3), label: 'Sipariş alındı, hazırlanıyor', location: 'Snoresis Depo · İzmir' }],
  },
  {
    id: 'SNR-2026-7315',
    email: DEMO_EMAIL,
    createdAt: hoursAgo(30),
    status: 'shipped',
    trackingNumber: '7310 4482 9051',
    carrier: 'Yurtiçi Kargo',
    location: 'İzmir Transfer Merkezi',
    estimatedDelivery: daysFromNow(1),
    items: [{ ...WRISTBAND, color: 'Gold', quantity: 1 }],
    total: 6999,
    events: [
      { at: hoursAgo(4), label: 'Transfer merkezinden çıktı', location: 'İzmir Transfer Merkezi' },
      { at: hoursAgo(20), label: 'Kargoya verildi', location: 'Bornova Şube · İzmir' },
      { at: hoursAgo(30), label: 'Sipariş alındı, hazırlanıyor', location: 'Snoresis Depo · İzmir' },
    ],
  },
  {
    id: 'SNR-2026-6120',
    email: DEMO_EMAIL,
    createdAt: hoursAgo(120),
    status: 'delivered',
    trackingNumber: '7310 4417 2268',
    carrier: 'Yurtiçi Kargo',
    location: 'Teslim edildi · Karşıyaka / İzmir',
    estimatedDelivery: daysFromNow(-2),
    items: [{ name: 'Şarj Aleti', color: 'Beyaz', quantity: 1, price: 499 }],
    total: 499,
    events: [
      { at: hoursAgo(50), label: 'Teslim edildi', location: 'Karşıyaka / İzmir' },
      { at: hoursAgo(60), label: 'Dağıtıma çıktı', location: 'Karşıyaka Şube · İzmir' },
      { at: hoursAgo(96), label: 'Kargoya verildi', location: 'Bornova Şube · İzmir' },
      { at: hoursAgo(120), label: 'Sipariş alındı, hazırlanıyor', location: 'Snoresis Depo · İzmir' },
    ],
  },
];
