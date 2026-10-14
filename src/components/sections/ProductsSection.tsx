import { useState } from 'react';
import { Check, Plus, RotateCcw, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../../context/cart';
import { PRODUCTS } from '../../data/products';
import { CLAIMS } from '../../data/site';
import { isLight } from '../../lib/color';
import { formatPrice, formatRating } from '../../lib/format';
import type { ColorOption, Product } from '../../types';
import { ProductArt } from '../ui/ProductArt';
import { Stars } from '../ui/StarRating';

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

/** `wide`: ikili ızgarada tek kalan kart; masaüstünde tam genişlikte, görsel solda yatay düzen. */
const ProductCard = ({ product, wide = false }: { product: Product; wide?: boolean }) => {
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
      } ${wide ? 'md:col-span-2 md:flex-row' : ''}`}
    >
      <div
        className={`relative flex items-center justify-center bg-[radial-gradient(80%_70%_at_50%_45%,#ffffff_0%,#eef2f9_100%)] ${
          featured
            ? 'aspect-[5/4] md:aspect-auto md:flex-1'
            : `aspect-[16/9] ${wide ? 'md:aspect-auto md:w-2/5 md:shrink-0' : ''}`
        }`}
      >
        {(featured || product.badge) && (
          <span className="absolute top-5 left-5 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
            {featured ? 'Amiral ürün' : product.badge}
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

      <div className={`flex flex-col gap-5 ${featured ? 'p-7 md:p-8' : 'p-6'} ${wide ? 'md:flex-1 md:p-8' : ''}`}>
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-wide text-brand">{product.tagline}</p>
            <h3 className={`mt-1 font-bold text-ink ${featured ? 'text-2xl sm:text-3xl' : 'text-xl'}`}>{product.name}</h3>
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
              <Stars value={product.rating.average} size={14} />
              <span className="font-semibold text-ink tabular-nums">{formatRating(product.rating.average)}</span>
              <span className="tabular-nums">({product.rating.count} değerlendirme)</span>
            </div>
          </div>
          <p
            className={`shrink-0 text-right font-display font-bold whitespace-nowrap text-ink tabular-nums ${featured ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'}`}
          >
            {product.oldPrice && (
              <span className="block text-xs font-semibold text-slate-400 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
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

const DeliveryBanner = () => (
  <div className="relative isolate mb-8 overflow-hidden rounded-[1.75rem] bg-night px-6 py-5 text-white sm:px-8">
    <div className="absolute -top-16 -left-10 -z-10 h-48 w-48 rounded-full bg-brand/40 blur-3xl blob" />
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <p className="flex items-center gap-3.5">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand text-white shadow-[0_8px_20px_-8px_rgb(79_70_229/0.9)]">
          <Truck size={21} strokeWidth={2.2} />
        </span>
        <span>
          <span className="block font-display text-lg leading-tight font-bold sm:text-xl">
            Ücretsiz Kargo &amp; 24 Saatte Kargoda
          </span>
          <span className="mt-0.5 block text-sm text-white/60">
            Hafta içi 15.00’e kadar verilen siparişler aynı gün yola çıkar.
          </span>
        </span>
      </p>
      <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/80">
        <li className="flex items-center gap-1.5">
          <RotateCcw size={15} className="text-indigo-300" /> {CLAIMS.returnDays} gün koşulsuz iade
        </li>
        <li className="flex items-center gap-1.5">
          <ShieldCheck size={15} className="text-indigo-300" /> 2 yıl garanti
        </li>
      </ul>
    </div>
  </div>
);

export const ProductsSection = () => (
  <section id="urunler" className="relative bg-mist py-24 md:py-32">
    <div className="container-x">
      <div className="mb-14">
        <div className="max-w-xl">
          <p className="section-label">
            <span className="h-0.5 w-10 rounded-full bg-brand" />
            Ürünler
          </p>
          <h2 className="section-title-compact text-ink">Gecenizi tamamlayan set</h2>
          <p className="mt-4 text-slate-600">
            Akıllı bileklik ve parmak klipsi ölçer, şarj ünitesi hazır tutar, kılıf yolda korur. Renginizi seçin, sepete
            ekleyin.
          </p>
        </div>
      </div>

      <DeliveryBanner />

      <div className="grid gap-6 md:grid-cols-2">
        {PRODUCTS.map((p, i) => (
          <ProductCard key={p.id} product={p} wide={i === PRODUCTS.length - 1 && PRODUCTS.length % 2 === 0} />
        ))}
      </div>

    </div>
  </section>
);
