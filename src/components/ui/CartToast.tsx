import { Check } from 'lucide-react';
import { useCart } from '../../context/cart';

export const CartToast = () => {
  const { lastAdded, openPanel, panel } = useCart();
  if (!lastAdded || panel !== 'none') return null;

  return (
    <div
      key={lastAdded.addedAt}
      role="status"
      className="animate-rise fixed right-4 bottom-4 left-4 z-40 mx-auto flex max-w-sm items-center gap-3 rounded-2xl bg-ink p-3 pr-4 text-white shadow-lift sm:left-auto sm:mx-0"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-500/15 text-emerald-400">
        <Check size={18} strokeWidth={3} />
      </span>
      <p className="min-w-0 flex-1 text-sm leading-snug">
        <span className="block truncate font-semibold">{lastAdded.product.name}</span>
        <span className="text-white/60">{lastAdded.color.name} · sepete eklendi</span>
      </p>
      <button
        type="button"
        onClick={() => openPanel('cart')}
        className="cursor-pointer text-sm font-semibold text-sky-300 hover:text-white"
      >
        Sepeti gör
      </button>
    </div>
  );
};
