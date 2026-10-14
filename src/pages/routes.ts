import { lazy, type ComponentType } from 'react';

// Ana sayfa dışındaki adresler. Vercel'de vercel.json tüm yolları index.html'e yönlendirir;
// sayfalar ayrı parçalar hâlinde yüklenir, ana sayfanın paket boyutu değişmez.
const ROUTES: Record<string, ComponentType> = {
  '/gizlilik': lazy(() => import('./PrivacyPage')),
  '/hesap-silme': lazy(() => import('./AccountDeletionPage')),
  '/odeme': lazy(() => import('./PaymentPage')),
  '/odeme/basarili': lazy(() => import('./PaymentResultPage').then((m) => ({ default: m.PaymentSuccessPage }))),
  '/odeme/basarisiz': lazy(() => import('./PaymentResultPage').then((m) => ({ default: m.PaymentFailurePage }))),
};

const normalize = (path: string) => path.replace(/\/+$/, '').toLowerCase() || '/';

/** Adrese karşılık gelen sayfa; ana sayfa (veya bilinmeyen adres) için null. */
export const matchRoute = (pathname: string) => ROUTES[normalize(pathname)] ?? null;
