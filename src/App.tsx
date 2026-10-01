import { useEffect, useState } from 'react';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/cart/CheckoutModal';
import { Footer } from './components/layout/Footer';
import { Navbar } from './components/layout/Navbar';
import { AboutSection } from './components/sections/AboutSection';
import { AppDownloadSection } from './components/sections/AppDownloadSection';
import { ContactSection } from './components/sections/ContactSection';
import { FeaturesSection } from './components/sections/FeaturesSection';
import { HeroSection } from './components/sections/HeroSection';
import { ProductsSection } from './components/sections/ProductsSection';
import { CartToast } from './components/ui/CartToast';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { SnoresisLoading } from './components/ui/SnoresisLoading';
import { useCart } from './context/cart';
import { CartProvider } from './context/CartProvider';
import { ToastProvider } from './context/ToastProvider';

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

const App = () => (
  <ErrorBoundary>
    <ToastProvider>
      <CartProvider>
        <Navbar />
        <main>
          <HeroSection />
          <AboutSection />
          <ProductsSection />
          <FeaturesSection />
          <AppDownloadSection />
          <ContactSection />
        </main>
        <Footer />
        <Panels />
        <CartToast />
      </CartProvider>
      <BootScreen />
    </ToastProvider>
  </ErrorBoundary>
);

export default App;
