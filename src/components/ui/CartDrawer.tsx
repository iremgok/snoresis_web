import React from 'react';
import { useCart } from '../../context/CartContext';
import { X, Trash2 } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, totalAmount, setIsCheckoutOpen } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end">
      <div className="bg-white w-full max-w-md h-full p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right">
        <div>
          <div className="flex items-center justify-between pb-4 border-b">
            <h3 className="text-lg font-bold text-slate-900">Sepetim</h3>
            <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          </div>

          <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
            {cart.length === 0 ? (
              <p className="text-slate-400 text-center py-8">Sepetinizde ürün bulunmamaktadır.</p>
            ) : (
              cart.map((item, index) => (
                <div key={index} className="flex items-center justify-between bg-slate-50 p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.product.imageIcon}</span>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{item.product.name}</h4>
                      <p className="text-xs text-slate-500">{item.product.price.toLocaleString('tr-TR')} TL</p>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(index)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {cart.length > 0 && (
          <div className="pt-4 border-t">
            <div className="flex justify-between font-bold text-lg mb-4 text-slate-900">
              <span>Toplam:</span>
              <span>{totalAmount.toLocaleString('tr-TR')} TL</span>
            </div>
            <button
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition cursor-pointer"
            >
              Siparişi Tamamla
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
