import React from 'react';
import { useCart } from '../../context/CartContext';
import { CheckCircle } from 'lucide-react';

export const SuccessModal: React.FC = () => {
  const { isSuccessOpen, setIsSuccessOpen } = useCart();

  if (!isSuccessOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-8 text-center shadow-2xl animate-in zoom-in-95">
        <CheckCircle size={64} className="text-emerald-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Siparişiniz Alındı!</h3>
        <p className="text-slate-500 text-sm mb-6">En kısa sürede sizinle iletişime geçeceğiz.</p>
        <button
          onClick={() => setIsSuccessOpen(false)}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition cursor-pointer"
        >
          Tamam
        </button>
      </div>
    </div>
  );
};
