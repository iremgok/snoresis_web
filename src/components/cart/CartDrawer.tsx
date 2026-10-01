import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../../context/cart';
import { formatPrice } from '../../lib/format';
import { Modal } from '../ui/Modal';
import { ProductArt } from '../ui/ProductArt';

export const CartDrawer = () => {
  const { items, count, total, setQuantity, removeItem, closePanel, openPanel } = useCart();

  return (
    <Modal title={`Sepetim${count ? ` (${count})` : ''}`} onClose={closePanel} variant="side">
      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-mist text-slate-400">
            <ShoppingBag size={28} />
          </span>
          <p className="mt-5 font-display text-lg font-semibold text-ink">Sepetiniz şimdilik boş</p>
          <p className="mt-1 text-sm text-slate-500">Akıllı yüzükle başlamaya ne dersiniz?</p>
          <button type="button" onClick={closePanel} className="btn-primary mt-6">
            Alışverişe Devam Et
          </button>
        </div>
      ) : (
        <>
          <ul className="scroll-panel space-y-3 px-6 py-2">
            {items.map((item) => (
              <li key={item.key} className="flex gap-4 rounded-2xl border border-line p-3">
                <div className="grid h-20 w-20 shrink-0 place-items-center rounded-xl bg-mist">
                  <ProductArt art={item.product.art} color={item.color.hex} className="h-16 w-16" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-display font-semibold text-ink">{item.product.name}</p>
                      <p className="flex items-center gap-1.5 text-xs text-slate-500">
                        <span
                          className="h-2.5 w-2.5 rounded-full ring-1 ring-black/10"
                          style={{ backgroundColor: item.color.hex }}
                        />
                        {item.color.name}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.key)}
                      className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-500"
                      aria-label={`${item.product.name} ürününü kaldır`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex items-center rounded-full border border-line">
                      <button
                        type="button"
                        onClick={() => setQuantity(item.key, item.quantity - 1)}
                        className="grid h-8 w-8 cursor-pointer place-items-center rounded-full text-slate-600 hover:bg-mist"
                        aria-label="Adedi azalt"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-7 text-center text-sm font-semibold tabular-nums">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(item.key, item.quantity + 1)}
                        className="grid h-8 w-8 cursor-pointer place-items-center rounded-full text-slate-600 hover:bg-mist"
                        aria-label="Adedi artır"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <p className="font-display font-semibold text-ink tabular-nums">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="border-t border-line bg-paper px-6 pt-5 pb-6">
            <dl className="space-y-2 text-sm">
              <div className="flex items-baseline justify-between text-slate-500">
                <dt>Kargo</dt>
                <dd className="font-semibold text-emerald-600">Ücretsiz</dd>
              </div>
              <div className="flex items-baseline justify-between text-ink">
                <dt className="font-semibold">Toplam</dt>
                <dd className="font-display text-2xl font-bold tabular-nums">{formatPrice(total)}</dd>
              </div>
            </dl>
            <div className="mt-5 grid gap-2.5">
              <button type="button" onClick={() => openPanel('checkout')} className="btn-primary w-full py-3.5">
                Ödemeye Geç <ArrowRight size={17} />
              </button>
              <button type="button" onClick={closePanel} className="btn-ghost w-full py-3.5">
                Alışverişe Devam Et
              </button>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};
