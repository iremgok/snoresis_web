import { useEffect, useState } from 'react';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/cart/CheckoutModal';
import { Footer } from './components/layout/Footer';
import { Navbar } from './components/layout/Navbar';
import { AboutSection } from './components/sections/AboutSection';
import { AppDownloadSection } from './components/sections/AppDownloadSection';
import { ContactSection } from './components/sections/ContactSection';
import { FaqSection } from './components/sections/FaqSection';
import { FeaturesSection } from './components/sections/FeaturesSection';
import { HeroSection } from './components/sections/HeroSection';
import { OrderTrackingSection } from './components/sections/OrderTrackingSection';
import { ProductsSection } from './components/sections/ProductsSection';
import { CartToast } from './components/ui/CartToast';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { SnoresisLoading } from './components/ui/SnoresisLoading';
import { useCart } from './context/cart';
import { CartProvider } from './context/CartProvider';
import { LegalProvider } from './context/LegalProvider';
import { ToastProvider } from './context/ToastProvider';
import { useHashScroll } from './lib/useHashScroll';

const Panels = () => {
  const { panel } = useCart();
  if (panel === 'cart') return <CartDrawer />;
  if (panel === 'checkout') return <CheckoutModal />;
  return null;
};

// index.html'deki statik yükleyiciyi devralır; yazı tipleri hazır olunca yumuşakça kaybolur
const BootScreen = () => {
  const [phase, setPhase] = useState<'shown' | 'leaving' | 'gone'>('shown');
  useEffect(() => {
    let timer = 0;
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      setPhase('leaving');
      timer = window.setTimeout(() => setPhase('gone'), 300);
    });
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);
  if (phase === 'gone') return null;
  return <SnoresisLoading variant="screen" leaving={phase === 'leaving'} />;
};

const App = () => {
  // Uygulamadan gelen /#siparis-takip gibi derin bağlantılar doğrudan bölümü açar.
  useHashScroll();
  return (
    <ErrorBoundary>
      <ToastProvider>
        <LegalProvider>
          <CartProvider>
            <Navbar />
            <main>
              <HeroSection />
              <AboutSection />
              <ProductsSection />
              <FeaturesSection />
              <AppDownloadSection />
              <FaqSection />
              <OrderTrackingSection />
              <ContactSection />
            </main>
            <Footer />
            <Panels />
            <CartToast />
          </CartProvider>
        </LegalProvider>
        <BootScreen />
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;
