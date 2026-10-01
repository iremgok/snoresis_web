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
import { useCart } from './context/cart';
import { CartProvider } from './context/CartProvider';

const Panels = () => {
  const { panel } = useCart();
  if (panel === 'cart') return <CartDrawer />;
  if (panel === 'checkout') return <CheckoutModal />;
  return null;
};

const App = () => (
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
);

export default App;
