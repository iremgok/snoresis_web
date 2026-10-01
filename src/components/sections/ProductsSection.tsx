import { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { useCart } from '../../context/cart';
import { PRODUCTS } from '../../data/products';
import { isLight } from '../../lib/color';
import { formatPrice } from '../../lib/format';
import type { ColorOption, Product } from '../../types';
import { ProductArt } from '../ui/ProductArt';

const ColorChips = ({
  colors,
  value,
  onChange,
  name,
}: {
  colors: ColorOption[];
  value: ColorOption;
  onChange: (c: ColorOption) => void;
  name: string;
}) => (
  <fieldset>
    <legend className="mb-2.5 text-xs font-semibold text-slate-500">
      Renk: <span className="text-ink">{value.name}</span>
    </legend>
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={`${name} renk seçimi`}>
      {colors.map((c) => {
        const selected = c.name === value.name;
        return (
          <button
            key={c.name}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(c)}
            className={`group flex cursor-pointer items-center gap-1.5 rounded-full border py-1 pr-3 pl-1 text-xs font-semibold transition ${
              selected ? 'border-ink bg-ink text-white' : 'border-line bg-white text-slate-600 hover:border-slate-400'
            }`}
          >
            <span
              className="grid h-5 w-5 place-items-center rounded-full ring-1 ring-black/10"
              style={{ backgroundColor: c.hex }}
            >
              {selected && <Check size={11} strokeWidth={3.5} className={isLight(c.hex) ? 'text-ink' : 'text-white'} />}
            </span>
            {c.name}
          </button>
        );
      })}
    </div>
  </fieldset>
);

const ProductCard = ({ product }: { product: Product }) => {
  const { addItem } = useCart();
  const [color, setColor] = useState(product.colors[0]);
  const [justAdded, setJustAdded] = useState(false);
  const featured = product.featured;

  const add = () => {
    addItem(product, color);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-line bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift ${
        featured ? 'md:row-span-2' : ''
      }`}
    >
      <div
        className={`relative flex items-center justify-center bg-[radial-gradient(80%_70%_at_50%_45%,#ffffff_0%,#eef2f9_100%)] ${
          featured ? 'aspect-[5/4] md:aspect-auto md:flex-1' : 'aspect-[16/9]'
        }`}
      >
        {featured && (
          <span className="absolute top-5 left-5 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
            Amiral ürün
          </span>
        )}
        {featured && (
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="aspect-square w-[78%] max-w-[440px] rounded-full border border-brand/10" />
            <div className="absolute aspect-square w-[58%] max-w-[330px] rounded-full border border-dashed border-brand/15" />
          </div>
        )}
        <ProductArt
          art={product.art}
          color={color.hex}
          className={`transition duration-500 group-hover:scale-[1.04] ${featured ? 'relative w-3/4 max-w-[360px]' : 'w-2/5 max-w-[180px]'}`}
        />
      </div>

      <div className={`flex flex-col gap-5 ${featured ? 'p-7 md:p-8' : 'p-6'}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-wide text-brand">{product.tagline}</p>
            <h3 className={`mt-1 font-bold text-ink ${featured ? 'text-3xl' : 'text-xl'}`}>{product.name}</h3>
          </div>
          <p className={`shrink-0 font-display font-bold text-ink tabular-nums ${featured ? 'text-2xl' : 'text-lg'}`}>
            {formatPrice(product.price)}
          </p>
        </div>

        {featured && <p className="text-[0.95rem] leading-relaxed text-slate-600">{product.description}</p>}

        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
          {product.highlights.map((h) => (
            <li key={h} className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-slate-400" />
              {h}
            </li>
          ))}
        </ul>

        <ColorChips colors={product.colors} value={color} onChange={setColor} name={product.name} />

        <button
          type="button"
          onClick={add}
          className={`btn mt-auto w-full py-3.5 ${
            justAdded ? 'bg-emerald-500 text-white' : 'bg-brand text-white hover:bg-brand-deep'
          }`}
        >
          {justAdded ? (
            <>
              <Check size={17} strokeWidth={3} /> Sepete Eklendi
            </>
          ) : (
            <>
              <Plus size={17} strokeWidth={2.6} /> Sepete Ekle
            </>
          )}
        </button>
      </div>
    </article>
  );
};

export const ProductsSection = () => (
  <section id="urunler" className="relative bg-mist py-24 md:py-32">
    <div className="container-x">
      <div className="mb-14">
        <div className="max-w-xl">
          <p className="section-label">
          <span className="h-0.5 w-10 rounded-full bg-brand" />
          Ürünler
        </p>
          <h2 className="section-title text-ink">Gecenizi tamamlayan üçlü</h2>
          <p className="mt-4 text-slate-600">
            Akıllı yüzük ölçer, şarj ünitesi hazır tutar, kılıf yolda korur. Renginizi seçin, sepete ekleyin.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {PRODUCTS.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  </section>
);
