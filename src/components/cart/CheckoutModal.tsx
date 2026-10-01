import { useState, type ChangeEvent, type FormEvent } from 'react';
import { ArrowLeft, CircleCheck, CreditCard, Lock } from 'lucide-react';
import { useCart } from '../../context/cart';
import { useToast } from '../../context/toast';
import { formatPrice } from '../../lib/format';
import type { CartItem } from '../../types';
import { Field } from '../ui/FormField';
import { Modal } from '../ui/Modal';
import { SnoresisLoading } from '../ui/SnoresisLoading';

type Form = {
  name: string;
  email: string;
  phone: string;
  address: string;
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
};

type Errors = Partial<Record<keyof Form, string>>;

const EMPTY: Form = { name: '', email: '', phone: '', address: '', cardName: '', cardNumber: '', expiry: '', cvv: '' };

const LABELS: Record<keyof Form, string> = {
  name: 'Ad Soyad',
  email: 'E-posta',
  phone: 'Telefon',
  address: 'Adres',
  cardName: 'Kart üzerindeki isim',
  cardNumber: 'Kart numarası',
  expiry: 'Son kullanma',
  cvv: 'CVV',
};

const digits = (v: string) => v.replace(/\D/g, '');

const formatters: Partial<Record<keyof Form, (v: string) => string>> = {
  cardNumber: (v) => digits(v).slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 '),
  expiry: (v) => {
    const d = digits(v).slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  },
  cvv: (v) => digits(v).slice(0, 4),
  phone: (v) => v.replace(/[^\d+\s()]/g, '').slice(0, 18),
};

const luhn = (num: string) => {
  let sum = 0;
  [...num].reverse().forEach((ch, i) => {
    let n = Number(ch);
    if (i % 2 === 1) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
  });
  return sum % 10 === 0;
};

const validate = (f: Form): Errors => {
  const e: Errors = {};
  if (f.name.trim().length < 3) e.name = 'Ad soyad girin';
  if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Geçerli bir e-posta girin';
  if (digits(f.phone).length < 10) e.phone = 'Geçerli bir telefon girin';
  if (f.address.trim().length < 10) e.address = 'Teslimat adresini eksiksiz girin';
  if (f.cardName.trim().length < 3) e.cardName = 'Kart üzerindeki ismi girin';
  const card = digits(f.cardNumber);
  if (card.length !== 16 || !luhn(card)) e.cardNumber = 'Kart numarası geçersiz';
  const [mm, yy] = f.expiry.split('/').map(Number);
  const now = new Date();
  const expired = !yy || 2000 + yy < now.getFullYear() || (2000 + yy === now.getFullYear() && mm < now.getMonth() + 1);
  if (!mm || mm < 1 || mm > 12 || expired) e.expiry = 'Geçerli bir tarih girin (AA/YY)';
  if (f.cvv.length < 3) e.cvv = 'CVV 3 haneli olmalı';
  return e;
};

type Order = { id: string; items: CartItem[]; total: number; email: string };

const Success = ({ order, onClose }: { order: Order; onClose: () => void }) => (
  <div className="overflow-y-auto px-6 pt-12 pb-7 text-center sm:px-8">
    <div className="relative mx-auto grid h-20 w-20 place-items-center">
      <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/30 [animation-iteration-count:2]" />
      <span className="relative grid h-20 w-20 place-items-center rounded-full bg-emerald-500 text-white">
        <CircleCheck size={40} strokeWidth={2.2} />
      </span>
    </div>
    <h2 className="mt-6 text-3xl font-bold text-ink">Siparişiniz Alındı!</h2>
    <p className="mt-2 text-sm text-slate-500">
      Sipariş özetiniz <span className="font-semibold text-ink">{order.email}</span> adresine gönderilecek.
    </p>

    <div className="mt-6 rounded-2xl border border-line bg-paper p-4 text-left text-sm">
      <div className="mb-3 flex justify-between border-b border-dashed border-line pb-3">
        <span className="text-slate-500">Sipariş no</span>
        <span className="font-mono font-semibold text-ink">{order.id}</span>
      </div>
      <ul className="space-y-1.5">
        {order.items.map((i) => (
          <li key={i.key} className="flex justify-between gap-3 text-slate-600">
            <span className="truncate">
              {i.quantity} × {i.product.name} <span className="text-slate-400">({i.color.name})</span>
            </span>
            <span className="shrink-0 tabular-nums">{formatPrice(i.product.price * i.quantity)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex justify-between border-t border-line pt-3 font-semibold text-ink">
        <span>Toplam</span>
        <span className="tabular-nums">{formatPrice(order.total)}</span>
      </div>
    </div>

    <button type="button" onClick={onClose} className="btn-primary mt-6 w-full py-3.5">
      Alışverişe Devam Et
    </button>
  </div>
);

export const CheckoutModal = () => {
  const { items, total, clear, closePanel, openPanel } = useCart();
  const { notify } = useToast();
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  const bind = (key: keyof Form) => ({
    name: key,
    value: form[key],
    error: errors[key],
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      const fmt = formatters[key];
      setForm((f) => ({ ...f, [key]: fmt ? fmt(e.target.value) : e.target.value }));
      if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
    },
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    const keys = Object.keys(found) as (keyof Form)[];
    if (keys.length) {
      document.querySelector<HTMLInputElement>(`[name="${keys[0]}"]`)?.focus();
      notify({
        tone: 'error',
        title: 'Ödeme tamamlanamadı',
        message: `Eksik ya da hatalı alanlar: ${keys.map((k) => LABELS[k]).join(', ')}. Lütfen kontrol ediniz.`,
      });
      return;
    }
    setSubmitting(true);
    // Ödeme simülasyonu — gerçek bir ödeme altyapısına bağlanmaz.
    window.setTimeout(() => {
      setOrder({
        id: `SNR-${Date.now().toString(36).toUpperCase().slice(-6)}`,
        items,
        total,
        email: form.email,
      });
      clear();
      setSubmitting(false);
    }, 1400);
  };

  if (order) {
    return (
      <Modal title="Siparişiniz Alındı" onClose={closePanel} hideTitle>
        <Success order={order} onClose={closePanel} />
      </Modal>
    );
  }

  const close = () => !submitting && closePanel();

  return (
    <Modal title="Ödeme" onClose={close}>
      {submitting && <SnoresisLoading variant="overlay" label="Ödemeniz işleniyor..." />}
      <form onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
        <div className="space-y-6 overflow-y-auto px-6 pb-6">
          <div className="flex items-center justify-between rounded-2xl bg-mist px-4 py-3 text-sm">
            <span className="text-slate-500">
              {items.reduce((n, i) => n + i.quantity, 0)} ürün ·{' '}
              <button type="button" onClick={() => openPanel('cart')} className="cursor-pointer font-semibold text-brand">
                sepeti düzenle
              </button>
            </span>
            <span className="font-display text-lg font-bold text-ink tabular-nums">{formatPrice(total)}</span>
          </div>

          <fieldset className="space-y-3">
            <legend className="mb-3 font-display font-semibold text-ink">Teslimat bilgileri</legend>
            <Field label="Ad Soyad" autoComplete="name" {...bind('name')} />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="E-posta" type="email" autoComplete="email" {...bind('email')} />
              <Field label="Telefon" type="tel" autoComplete="tel" placeholder="05xx xxx xx xx" {...bind('phone')} />
            </div>
            <Field label="Adres" autoComplete="street-address" placeholder="Mahalle, sokak, no, ilçe / il" {...bind('address')} />
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="mb-3 flex items-center gap-2 font-display font-semibold text-ink">
              <CreditCard size={18} className="text-brand" /> Kart bilgileri
            </legend>
            <Field label="Kart üzerindeki isim" autoComplete="cc-name" {...bind('cardName')} />
            <Field
              label="Kart numarası"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="0000 0000 0000 0000"
              {...bind('cardNumber')}
            />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Son kullanma" inputMode="numeric" autoComplete="cc-exp" placeholder="AA/YY" {...bind('expiry')} />
              <Field label="CVV" inputMode="numeric" autoComplete="cc-csc" placeholder="•••" {...bind('cvv')} />
            </div>
          </fieldset>

          <p className="flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2.5 text-xs leading-relaxed text-amber-800">
            <Lock size={14} className="mt-0.5 shrink-0" />
            Bu bir ödeme simülasyonudur; kart bilgileriniz hiçbir yere gönderilmez veya kaydedilmez.
          </p>
        </div>

        <div className="flex gap-2.5 border-t border-line bg-paper px-6 py-4">
          <button
            type="button"
            onClick={() => openPanel('cart')}
            disabled={submitting}
            className="btn-ghost px-4"
            aria-label="Sepete dön"
          >
            <ArrowLeft size={17} />
          </button>
          <button type="submit" disabled={submitting} className="btn-primary flex-1 py-3.5">
            {submitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                İşleniyor…
              </>
            ) : (
              <>Ödemeyi Tamamla · {formatPrice(total)}</>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
