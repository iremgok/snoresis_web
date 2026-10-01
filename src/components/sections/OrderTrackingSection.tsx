import { useState, type FormEvent } from 'react';
import { ArrowLeft, CircleAlert, CircleCheck, MapPin, Package, PackageSearch, Truck, XCircle, type LucideIcon } from 'lucide-react';
import { useToast } from '../../context/toast';
import { DEMO_EMAIL } from '../../data/orders';
import { toFriendlyMessage } from '../../lib/errors';
import { formatPrice } from '../../lib/format';
import { CANCEL_REASONS, cancelOrder, lookupOrder } from '../../lib/orders';
import type { CancelReason, OrderStatus, TrackedOrder } from '../../types';
import { Field, TextAreaField } from '../ui/FormField';
import { SnoresisLoading } from '../ui/SnoresisLoading';

const STATUS: Record<OrderStatus, { label: string; icon: LucideIcon; pill: string }> = {
  preparing: { label: 'Hazırlanıyor', icon: Package, pill: 'bg-amber-50 text-amber-700 ring-amber-200' },
  shipped: { label: 'Kargoda', icon: Truck, pill: 'bg-indigo-50 text-indigo-700 ring-indigo-200' },
  delivered: { label: 'Teslim Edildi', icon: CircleCheck, pill: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  cancelled: { label: 'İptal Edildi', icon: XCircle, pill: 'bg-slate-100 text-slate-600 ring-slate-200' },
};

const STEPS: OrderStatus[] = ['preparing', 'shipped', 'delivered'];

const day = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' });
const dateTime = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
// "YYYY-MM-DD" yerel tarih olarak okunur (UTC kaymasıyla bir önceki güne düşmesin)
const localDate = (iso: string) => new Date(`${iso}T12:00:00`);

const Progress = ({ status }: { status: OrderStatus }) => {
  const reached = STEPS.indexOf(status);
  return (
    <ol className="grid grid-cols-3 gap-2" aria-label="Sipariş aşamaları">
      {STEPS.map((step, i) => {
        const done = i <= reached;
        const { label, icon: Icon } = STATUS[step];
        return (
          <li key={step} className="flex flex-col gap-2" aria-current={i === reached ? 'step' : undefined}>
            <span className={`h-1.5 rounded-full ${done ? 'bg-brand' : 'bg-line'}`} />
            <span className={`flex items-center gap-1.5 text-xs font-semibold ${done ? 'text-ink' : 'text-slate-400'}`}>
              <Icon size={14} /> {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
};

const CancelPanel = ({ order, onCancelled }: { order: TrackedOrder; onCancelled: (o: TrackedOrder) => void }) => {
  const { notify, notifyError } = useToast();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<CancelReason | null>(null);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!reason) {
      setError('Lütfen bir iptal nedeni seçin');
      return;
    }
    setSending(true);
    try {
      const updated = await cancelOrder(order, reason, reason === 'other' ? note : undefined);
      notify({
        tone: 'success',
        title: 'Siparişiniz iptal edildi',
        message: `${formatPrice(order.total)} tutarındaki ödemeniz 3–5 iş günü içinde kartınıza iade edilecek.`,
      });
      onCancelled(updated);
    } catch (err) {
      notifyError(err, 'İptal talebi gönderilemedi', 'İptal talebiniz şu anda iletilemedi. Lütfen biraz sonra tekrar deneyiniz.');
    } finally {
      setSending(false);
    }
  };

  if (!open) {
    return (
      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-paper p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">Siparişiniz henüz kargoya verilmedi; dilerseniz iptal edebilirsiniz.</p>
        <button type="button" onClick={() => setOpen(true)} className="btn-ghost shrink-0 py-2.5 text-rose-600 hover:border-rose-300">
          Siparişi İptal Et
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="relative rounded-2xl border border-rose-200 bg-rose-50/40 p-4 sm:p-5">
      {sending && <SnoresisLoading variant="overlay" label="İptal talebiniz iletiliyor..." />}
      <fieldset>
        <legend className="font-display font-semibold text-ink">Neden iptal etmek istiyorsunuz?</legend>
        <p className="mt-0.5 text-xs text-slate-500">Bir neden seçmeniz gerekiyor; geri bildiriminiz hizmetimizi geliştirmemize yardımcı olur.</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2" role="radiogroup" aria-invalid={!!error}>
          {CANCEL_REASONS.map(({ value, label }) => (
            <label
              key={value}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border bg-white px-3.5 py-3 text-sm font-medium transition ${
                reason === value ? 'border-brand text-ink ring-4 ring-brand/10' : error ? 'border-rose-300 text-slate-600' : 'border-line text-slate-600 hover:border-slate-300'
              }`}
            >
              <input
                type="radio"
                name="cancel-reason"
                value={value}
                checked={reason === value}
                onChange={() => {
                  setReason(value);
                  setError('');
                }}
                className="h-4 w-4 accent-[var(--color-brand)]"
              />
              {label}
            </label>
          ))}
        </div>
        {error && (
          <p role="alert" className="mt-2 text-xs text-rose-500">
            {error}
          </p>
        )}
      </fieldset>
      {reason === 'other' && (
        <TextAreaField
          className="mt-3"
          label="Kısaca açıklar mısınız? (isteğe bağlı)"
          rows={2}
          maxLength={300}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      )}
      <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button type="button" onClick={() => setOpen(false)} disabled={sending} className="btn-ghost py-2.5">
          Vazgeç
        </button>
        <button type="submit" disabled={sending} className="btn bg-rose-600 py-2.5 text-white hover:bg-rose-700">
          İptal Talebini Gönder
        </button>
      </div>
    </form>
  );
};

const OrderDetails = ({ order, onBack, onChange }: { order: TrackedOrder; onBack: () => void; onChange: (o: TrackedOrder) => void }) => {
  const { label, icon: StatusIcon, pill } = STATUS[order.status];
  const cancelled = order.status === 'cancelled';
  const reasonLabel = CANCEL_REASONS.find((r) => r.value === order.cancellation?.reason)?.label;

  const facts = [
    { term: 'Sipariş Durumu', value: label, icon: StatusIcon },
    { term: 'Nerede', value: cancelled ? '—' : order.location, icon: MapPin },
    {
      term: order.status === 'delivered' ? 'Teslim Tarihi' : 'Tahmini Teslimat',
      value: cancelled ? '—' : day.format(localDate(order.estimatedDelivery)),
      icon: Truck,
    },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <button type="button" onClick={onBack} className="mb-2 inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-ink">
            <ArrowLeft size={14} /> Başka sipariş sorgula
          </button>
          <p className="font-mono text-lg font-semibold text-ink">{order.id}</p>
          <p className="text-xs text-slate-500">
            {dateTime.format(new Date(order.createdAt))} tarihinde verildi
            {order.trackingNumber && ` · ${order.carrier} takip no: ${order.trackingNumber}`}
          </p>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${pill}`}>
          <StatusIcon size={14} /> {label}
        </span>
      </div>

      {cancelled ? (
        <p className="flex items-start gap-2.5 rounded-2xl bg-slate-100 p-4 text-sm text-slate-600">
          <CircleAlert size={18} className="mt-0.5 shrink-0 text-slate-500" />
          <span>
            Bu sipariş iptal edildi{reasonLabel && <> (neden: {reasonLabel})</>}. Ödemeniz 3–5 iş günü içinde kartınıza iade
            edilir.
          </span>
        </p>
      ) : (
        <Progress status={order.status} />
      )}

      <dl className="grid gap-3 sm:grid-cols-3">
        {facts.map(({ term, value, icon: Icon }) => (
          <div key={term} className="rounded-2xl border border-line bg-paper p-4">
            <dt className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <Icon size={14} /> {term}
            </dt>
            <dd className="mt-1 font-display font-semibold text-ink">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="mb-3 text-sm font-semibold tracking-normal text-ink">Kargo hareketleri</h3>
          <ol className="relative space-y-4 border-l border-line pl-5">
            {order.events.map((ev, i) => (
              <li key={ev.at + ev.label} className="relative">
                <span className={`absolute top-1 -left-[1.6rem] h-2.5 w-2.5 rounded-full ring-4 ring-white ${i === 0 ? 'bg-brand' : 'bg-slate-300'}`} />
                <p className={`text-sm font-semibold ${i === 0 ? 'text-ink' : 'text-slate-600'}`}>{ev.label}</p>
                <p className="text-xs text-slate-500">
                  {ev.location} · {dateTime.format(new Date(ev.at))}
                </p>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold tracking-normal text-ink">Sipariş içeriği</h3>
          <ul className="space-y-2 text-sm">
            {order.items.map((it) => (
              <li key={it.name + it.color} className="flex justify-between gap-3 text-slate-600">
                <span>
                  {it.quantity} × {it.name} <span className="text-slate-400">({it.color})</span>
                </span>
                <span className="shrink-0 tabular-nums">{formatPrice(it.price * it.quantity)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 flex justify-between border-t border-line pt-3 text-sm font-semibold text-ink">
            <span>Toplam</span>
            <span className="tabular-nums">{formatPrice(order.total)}</span>
          </p>
        </div>
      </div>

      {order.status === 'preparing' && <CancelPanel order={order} onCancelled={onChange} />}
    </div>
  );
};

type Errors = { number?: string; email?: string };

const LookupForm = ({ onFound }: { onFound: (o: TrackedOrder) => void }) => {
  const [number, setNumber] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [failure, setFailure] = useState('');
  const [searching, setSearching] = useState(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found: Errors = {};
    if (number.trim().length < 5) found.number = 'Sipariş veya kargo numaranızı girin';
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) found.email = 'Geçerli bir e-posta adresi girin';
    setErrors(found);
    setFailure('');
    const first = Object.keys(found)[0];
    if (first) {
      e.currentTarget.querySelector<HTMLElement>(`[name="track-${first}"]`)?.focus();
      return;
    }
    setSearching(true);
    try {
      onFound(await lookupOrder(number, email));
    } catch (err) {
      setFailure(toFriendlyMessage(err, 'Siparişiniz şu anda sorgulanamadı. Lütfen biraz sonra tekrar deneyiniz.'));
    } finally {
      setSearching(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate aria-busy={searching} className="relative space-y-4">
      {searching && <SnoresisLoading variant="overlay" label="Siparişiniz aranıyor..." />}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Sipariş / Kargo Numarası"
          name="track-number"
          placeholder="SNR-2026-8942"
          autoComplete="off"
          spellCheck={false}
          value={number}
          error={errors.number}
          onChange={(e) => {
            setNumber(e.target.value);
            if (errors.number) setErrors((er) => ({ ...er, number: undefined }));
          }}
        />
        <Field
          label="E-posta Adresi"
          name="track-email"
          type="email"
          autoComplete="email"
          placeholder="Siparişte kullandığınız adres"
          value={email}
          error={errors.email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((er) => ({ ...er, email: undefined }));
          }}
        />
      </div>
      {failure && (
        <p role="alert" className="flex items-start gap-2 rounded-xl bg-rose-50 px-3.5 py-3 text-sm text-rose-700">
          <CircleAlert size={17} className="mt-0.5 shrink-0" /> {failure}
        </p>
      )}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">
          Sipariş numaranız onay e-postanızda yer alır.
          {import.meta.env.DEV && (
            <>
              {' '}
              <span className="text-slate-400">Geliştirme: SNR-2026-8942 · {DEMO_EMAIL}</span>
            </>
          )}
        </p>
        <button type="submit" disabled={searching} className="btn-primary px-7 py-3.5">
          <PackageSearch size={17} /> Siparişimi Bul
        </button>
      </div>
    </form>
  );
};

export const OrderTrackingSection = () => {
  const [order, setOrder] = useState<TrackedOrder | null>(null);

  return (
    <section id="siparis-takip" className="bg-mist py-24 md:py-28" aria-labelledby="takip-title">
      <div className="container-x">
        <div className="mx-auto max-w-3xl">
          <span className="eyebrow text-brand">
            <span className="h-px w-8 bg-brand" />
            Sipariş Takip
          </span>
          <h2 id="takip-title" className="section-title text-ink">
            Siparişiniz nerede?
          </h2>
          <p className="mt-4 max-w-lg leading-relaxed text-slate-600">
            Sipariş ya da kargo numaranızla durumunu, konumunu ve tahmini teslim tarihini görün. Kargoya verilmemiş
            siparişlerinizi buradan iptal edebilirsiniz.
          </p>

          <div className="mt-10 rounded-[1.75rem] border border-line bg-white p-6 shadow-soft sm:p-8">
            {order ? (
              <OrderDetails order={order} onBack={() => setOrder(null)} onChange={setOrder} />
            ) : (
              <LookupForm onFound={setOrder} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
