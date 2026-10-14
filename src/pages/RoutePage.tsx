import { Suspense, type ComponentType } from 'react';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';
import { SnoresisLoading } from '../components/ui/SnoresisLoading';
import { CartProvider } from '../context/CartProvider';
import { LegalProvider } from '../context/LegalProvider';
import { ToastProvider } from '../context/ToastProvider';
import { isEmbedded } from '../lib/route';

/** Tek başına açılan sayfalar için sağlayıcılar (bildirim, yasal metinler, sepet). */
export const RoutePage = ({ page: Page }: { page: ComponentType }) => (
  <ErrorBoundary>
    <ToastProvider>
      <LegalProvider cookieBanner={!isEmbedded()}>
        <CartProvider>
          <Suspense fallback={<SnoresisLoading variant="screen" />}>
            <Page />
          </Suspense>
        </CartProvider>
      </LegalProvider>
    </ToastProvider>
  </ErrorBoundary>
);
