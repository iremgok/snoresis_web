import React from 'react';
import { useCart } from '../../context/CartContext';
import { X } from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const { isCheckoutOpen, setIsCheckoutOpen, totalAmount, setIsSuccessOpen, clearCart } = useCart();

  if (!isCheckoutOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCheckoutOpen(false);
    clearCart();
    setIsSuccessOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-4 border-b mb-6">
          <h3 className="text-lg font-bold text-slate-900">Ödeme Bilgileri</h3>
          <button onClick={() => setIsCheckoutOpen(false)} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <div className="bg-blue-50 p-4 rounded-xl mb-6 text-center">
          <span className="text-xs text-blue-600 font-semibold uppercase">Toplam Ödenecek Tutar</span>
          <div className="text-2xl font-black text-blue-900">{totalAmount.toLocaleString('tr-TR')} TL</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Ad Soyad *</label>
            <input required type="text" placeholder="İrem Gök" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-blue-600" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Kart Numarası *</label>
            <input required type="text" placeholder="1234 5678 9012 3456" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-blue-600" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Son Kullanma *</label>
              <input required type="text" placeholder="MM/YY" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-blue-600" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">CVV *</label>
              <input required type="text" placeholder="123" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-blue-600" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Teslimat Adresi *</label>
            <textarea required rows={2} placeholder="İzmir, Türkiye" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-blue-600"></textarea>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setIsCheckoutOpen(false)} className="w-1/2 border border-slate-200 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-50 transition">
              İptal
            </button>
            <button type="submit" className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition cursor-pointer">
              Ödemeyi Tamamla
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
