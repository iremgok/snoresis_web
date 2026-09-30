import React from 'react';
import { useCart } from '../../context/CartContext';
import { ShoppingBag } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { cart, setIsCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md">
            S
          </div>
          <span className="text-xl font-bold text-slate-800">Snoresis</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <a href="#about" className="hover:text-blue-600 transition">Hakkımızda</a>
          <a href="#products" className="hover:text-blue-600 transition">Ürünler</a>
          <a href="#features" className="hover:text-blue-600 transition">Özellikler</a>
          <a href="#contact" className="hover:text-blue-600 transition">İletişim</a>
        </nav>

        <button
          onClick={() => setIsCartOpen(true)}
          className="bg-slate-900 text-white text-sm font-semibold px-5 py-2.5 rounded-full flex items-center gap-2 hover:bg-slate-800 transition shadow-sm cursor-pointer"
        >
          <ShoppingBag size={16} />
          <span>Sepet</span>
          {cart.length > 0 && (
            <span className="bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {cart.length}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
