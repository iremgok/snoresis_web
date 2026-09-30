import React from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { PRODUCTS } from './data/products';
import { ShoppingBag, X, Trash2, CheckCircle } from 'lucide-react';

const Navbar: React.FC = () => {
  const { cart, setIsCartOpen } = useCart();
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md">S</div>
          <span className="text-xl font-bold text-slate-800">Snoresis</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <a href="#about" className="hover:text-blue-600 transition">Hakkımızda</a>
          <a href="#products" className="hover:text-blue-600 transition">Ürünler</a>
          <a href="#contact" className="hover:text-blue-600 transition">İletişim</a>
        </nav>
        <button onClick={() => setIsCartOpen(true)} className="bg-slate-900 text-white text-sm font-semibold px-5 py-2.5 rounded-full flex items-center gap-2 hover:bg-slate-800 transition cursor-pointer">
          <ShoppingBag size={16} />
          <span>Sepet</span>
          {cart.length > 0 && <span className="bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{cart.length}</span>}
        </button>
      </div>
    </header>
  );
};

const HeroSection: React.FC = () => (
  <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white py-20 px-6">
    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">Uykunuzun Kontrolü <br />Artık Sizde</h1>
        <p className="text-blue-100 text-lg mb-8">Snoresis ile horlama ve uyku apnesini teknolojinin gücüyle kontrol edin. Daha kaliteli uykular için gelişmiş çözümler.</p>
        <a href="#products" className="inline-block bg-white text-slate-900 font-bold px-7 py-3.5 rounded-xl hover:bg-blue-50 transition shadow-lg">Ürünleri Keşfet</a>
      </div>
      <div className="flex justify-center">
        <div className="w-64 h-64 md:w-80 md:h-80 bg-blue-600/30 rounded-full flex items-center justify-center text-8xl md:text-9xl shadow-2xl backdrop-blur-md animate-pulse">😴</div>
      </div>
    </div>
  </section>
);

const ProductsSection: React.FC = () => {
  const { addToCart } = useCart();
  return (
    <section id="products" className="py-20 px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Ürünlerimiz</h2>
          <p className="text-slate-500 max-w-xl mx-auto">Bilimsel olarak test edilmiş, kullanıcı dostu ve etkili uyku sağlığı çözümlerimizi keşfedin.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {PRODUCTS.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition flex flex-col justify-between border border-slate-100">
              <div>
                <div className="text-6xl text-center mb-6">{product.imageIcon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{product.name}</h3>
                <p className="text-slate-500 text-sm mb-6">{product.description}</p>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 mb-4">{product.price.toLocaleString('tr-TR')} TL</div>
                <button onClick={() => addToCart(product)} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition cursor-pointer">Sepete Ekle</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer: React.FC = () => (
  <footer className="bg-slate-900 text-white py-16 px-6">
    <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
      <div>
        <h3 className="text-xl font-bold mb-4">Snoresis</h3>
        <p className="text-slate-400 text-sm">Uyku kalitenizi artırmak için geliştirilmiş teknoloji çözümleri.</p>
      </div>
      <div>
        <h4 className="font-bold mb-4">Uygulamamızı İndirin</h4>
        <div className="flex gap-4">
          <div className="bg-slate-800 p-3 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer">▶ Google Play</div>
          <div className="bg-slate-800 p-3 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer">🍎 App Store</div>
        </div>
      </div>
      <div>
        <h4 className="font-bold mb-4">İletişim</h4>
        <p className="text-slate-400 text-sm">info@snoresis.com | +90 555 123 4567</p>
      </div>
    </div>
  </footer>
);

export const App: React.FC = () => (
  <CartProvider>
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />
      <HeroSection />
      <ProductsSection />
      <Footer />
    </div>
  </CartProvider>
);

export default App;
