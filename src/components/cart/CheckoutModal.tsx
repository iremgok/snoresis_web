import { useState, type ChangeEvent, type FormEvent } from 'react';
import { ArrowLeft, Check, CircleCheck, CreditCard, Lock, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../../context/cart';
import { useLegal } from '../../context/legal';
import { useToast } from '../../context/toast';
import { formatPrice } from '../../lib/format';
import { newOrderId, recordOrder } from '../../lib/orders';
import type { CartItem } from '../../types';
import { Field } from '../ui/FormField';
import { Modal } from '../ui/Modal';
import { PaymentLogos, SecurityBadges } from '../ui/PaymentBadges';
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

type Errors = Partial<Record<keyof Form | 'agreement', string>>;

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

const CARD_FIELDS: (keyof Form)[] = ['cardName', 'cardNumber', 'expiry', 'cvv'];

// Hatanın kök nedenine göre tek, anlaşılır bir bildirim seçer
const describeErrors = (keys: (keyof Errors)[]) => {
  const fields = keys.filter((k): k is keyof Form => k !== 'agreement');
  const delivery = fields.filter((k) => !CARD_FIELDS.includes(k));
  if (delivery.length) {
    return {
      title: 'Teslimat bilgileri eksik',
      message: `Siparişinizi gönderebilmemiz için lütfen şu alanları kontrol ediniz: ${delivery.map((k) => LABELS[k]).join(', ')}.`,
    };
  }
  if (fields.length) {
    return {
      title: 'Ödeme tamamlanamadı',
      message: 'Ödeme tamamlanamadı. Lütfen kart bilgilerinizi kontrol ediniz.',
    };
  }
  return {
    title: 'Sözleşme onayı gerekli',
    message: "Siparişi tamamlamak için Mesafeli Satış Sözleşmesi ve Ön Bilgilendirme Formu'nu onaylamanız gerekir.",
  };
};

const validate = (f: Form, agreed: boolean): Errors => {
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
  if (!agreed) e.agreement = 'Devam etmek için sözleşmeyi onaylayın';
  return e;
};

type Order = { id: string; items: CartItem[]; total: number; email: string };

const Success = ({ order, onClose }: { order: Order; onClose: () => void }) => (
  <div className="scroll-panel px-6 pt-12 pb-7 text-center sm:px-8">
    <div className="relative mx-auto grid h-20 w-20 place-items-center">
      <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/30 [animation-iteration-count:2]" />
      <span className="relative grid h-20 w-20 place-items-center rounded-full bg-emerald-500 text-white">
        <CircleCheck size={40} strokeWidth={2.2} />
      </span>
    </div>
    <h2 className="mt-6 text-3xl font-bold text-ink">Siparişiniz Alındı!</h2>
    <p className="mt-2 text-sm text-slate-500">
      Sipariş özetiniz ve sözleşme kopyanız <span className="font-semibold text-ink">{order.email}</span> adresine
      gönderilecek.
    </p>
    <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand/10 px-3.5 py-1.5 text-xs font-semibold text-brand">
      <Truck size={14} /> Ücretsiz kargo · 24 saat içinde kargoda
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

    <p className="mt-4 text-xs text-slate-500">
      Siparişinizi bu numara ve e-posta adresinizle <span className="font-semibold text-ink">Sipariş Takip</span>{' '}
      bölümünden izleyebilirsiniz.
    </p>
    <button type="button" onClick={onClose} className="btn-primary mt-6 w-full py-3.5">
      Alışverişe Devam Et
    </button>
  </div>
);

export const CheckoutModal = () => {
  const { items, total, clear, closePanel, openPanel } = useCart();
  const { notify } = useToast();
  const { openPolicy } = useLegal();
  const [agreed, setAgreed] = useState(false);
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

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validate(form, agreed);
    setErrors(found);
    const keys = Object.keys(found) as (keyof Errors)[];
    if (keys.length) {
      e.currentTarget.querySelector<HTMLInputElement>(`[name="${keys[0]}"]`)?.focus();
      notify({ tone: 'error', ...describeErrors(keys) });
      return;
    }
    setSubmitting(true);
    // Ödeme simülasyonu — gerçek bir ödeme altyapısına bağlanmaz.
    window.setTimeout(() => {
      const id = newOrderId();
      recordOrder(id, form.email, items, total);
      setOrder({ id, items, total, email: form.email });
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
      {submitting && <SnoresisLoading variant="overlay" label="3D Secure doğrulaması yapılıyor..." />}
      <form onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
        <div className="scroll-panel space-y-6 px-6 pb-6">
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
            <legend className="mb-3 flex w-full items-center justify-between gap-2 font-display font-semibold text-ink">
              <span className="flex items-center gap-2">
                <CreditCard size={18} className="text-brand" /> Kart bilgileri
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
                <Lock size={12} strokeWidth={2.6} /> Güvenli ödeme
              </span>
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

          <div className="rounded-2xl border border-line bg-paper p-4">
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <ShieldCheck size={18} strokeWidth={2.3} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">3D Secure ile korunan ödeme</p>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                  Ödemeyi tamamladığınızda bankanızın doğrulama ekranına yönlendirilir, telefonunuza gelen SMS kodu ile
                  işlemi onaylarsınız. Bağlantınız 256-bit SSL ile şifrelenir; kart bilgileriniz Snoresis sunucularında
                  saklanmaz.
                </p>
              </div>
            </div>
            <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3.5">
              <SecurityBadges />
              <PaymentLogos />
            </div>
          </div>

          <div>
            <label className="flex cursor-pointer items-start gap-3 text-[0.82rem] leading-relaxed text-slate-600">
              <span className="relative mt-0.5 grid shrink-0 place-items-center">
                <input
                  type="checkbox"
                  name="agreement"
                  required
                  checked={agreed}
                  onChange={(e) => {
                    setAgreed(e.target.checked);
                    if (errors.agreement) setErrors((er) => ({ ...er, agreement: undefined }));
                  }}
                  aria-invalid={!!errors.agreement}
                  aria-describedby={errors.agreement ? 'agreement-error' : undefined}
                  className={`peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 bg-white transition checked:border-brand checked:bg-brand focus-visible:ring-4 focus-visible:ring-brand/15 ${
                    errors.agreement ? 'border-rose-400' : 'border-slate-300'
                  }`}
                />
                <Check
                  size={13}
                  strokeWidth={3.5}
                  className="pointer-events-none absolute text-white opacity-0 peer-checked:opacity-100"
                />
              </span>
              <span>
                <button
                  type="button"
                  onClick={() => openPolicy('distance-sales')}
                  className="cursor-pointer font-semibold text-ink underline decoration-slate-300 underline-offset-2 hover:decoration-brand"
                >
                  Mesafeli Satış Sözleşmesi
                </button>{' '}
                ve{' '}
                <button
                  type="button"
                  onClick={() => openPolicy('pre-info')}
                  className="cursor-pointer font-semibold text-ink underline decoration-slate-300 underline-offset-2 hover:decoration-brand"
                >
                  Ön Bilgilendirme Formu
                </button>
                'nu okudum, kabul ediyorum.
              </span>
            </label>
            {errors.agreement && (
              <p id="agreement-error" className="mt-1.5 pl-8 text-xs text-rose-500">
                {errors.agreement}
              </p>
            )}
          </div>

          <p className="text-[0.7rem] leading-relaxed text-slate-400">
            Bu sürümde ödeme simüle edilir; kart bilgileriniz hiçbir yere gönderilmez veya kaydedilmez.
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
