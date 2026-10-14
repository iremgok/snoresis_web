import { useEffect, useState, type FormEvent } from 'react';
import { Lock, ShoppingBag, Truck } from 'lucide-react';
import { AgreementCheck } from '../components/checkout/AgreementCheck';
import { BuyerFields } from '../components/checkout/BuyerFields';
import { SecurePaymentNote } from '../components/checkout/SecurePaymentNote';
import { PageHeading, PageShell } from '../components/layout/PageShell';
import { SnoresisLoading } from '../components/ui/SnoresisLoading';
import { useToast } from '../context/toast';
import { toFriendlyMessage } from '../lib/errors';
import { formatPrice } from '../lib/format';
import {
  BUYER_LABELS,
  EMPTY_BUYER,
  fetchQuote,
  startPayment,
  validateBuyer,
  type Buyer,
  type BuyerErrors,
  type Quote,
} from '../lib/payment';
import { isEmbedded } from '../lib/route';

// /odeme?items=smart_wristband:black:1,charger:white:2&source=app
// Mobil uygulama In-App WebView'den bu adresi açar. Sepet yalnızca ürün/renk/adet taşır;
// fiyatlar sunucuda hesaplanır, kart bilgileri iyzico'nun 3D Secure sayfasında alınır.

type Load = { state: 'loading' } | { state: 'error'; message: string } | { state: 'ready'; quote: Quote };

const OrderSummary = ({ quote }: { quote: Quote }) => (
  <div className="rounded-3xl border border-line bg-white p-4 sm:p-5">
    <p className="flex items-center gap-2 font-display font-semibold text-ink">
      <ShoppingBag size={17} className="text-brand" /> Sipariş özeti
    </p>
    <ul className="mt-3 space-y-2.5 text-sm">
      {quote.lines.map((l) => (
        <li key={`${l.productId}:${l.color}`} className="flex items-start justify-between gap-3">
          <span className="min-w-0 text-slate-600">
            <span className="font-semibold text-ink">{l.quantity} ×</span> {l.name}{' '}
            <span className="text-slate-400">({l.color})</span>
          </span>
          <span className="shrink-0 font-semibold text-ink tabular-nums">{formatPrice(l.lineTotal)}</span>
        </li>
      ))}
    </ul>
    <dl className="mt-4 space-y-1.5 border-t border-dashed border-line pt-3 text-sm">
      <div className="flex justify-between text-slate-500">
        <dt className="flex items-center gap-1.5">
          <Truck size={14} /> Kargo
        </dt>
        <dd className="font-semibold text-emerald-600">Ücretsiz</dd>
      </div>
      <div className="flex items-baseline justify-between text-ink">
        <dt className="font-semibold">Toplam (KDV dahil)</dt>
        <dd className="font-display text-xl font-bold tabular-nums">{formatPrice(quote.total)}</dd>
      </div>
    </dl>
  </div>
);

const PaymentPage = () => {
  const embedded = isEmbedded();
  const items = new URLSearchParams(window.location.search).get('items') ?? '';
  const { notify } = useToast();
  const [load, setLoad] = useState<Load>(() =>
    items
      ? { state: 'loading' }
      : { state: 'error', message: 'Sepetiniz boş görünüyor. Lütfen ürün ekleyip tekrar deneyiniz.' },
  );
  const [buyer, setBuyer] = useState<Buyer>(EMPTY_BUYER);
  const [errors, setErrors] = useState<BuyerErrors>({});
  const [agreed, setAgreed] = useState(false);
  const [agreementError, setAgreementError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!items) return;
    let cancelled = false;
    fetchQuote(items)
      .then((quote) => !cancelled && setLoad({ state: 'ready', quote }))
      .catch((err: unknown) => {
        if (!cancelled)
          setLoad({
            state: 'error',
            message: toFriendlyMessage(err, 'Sipariş özeti yüklenemedi. Lütfen tekrar deneyiniz.'),
          });
      });
    return () => {
      cancelled = true;
    };
  }, [items]);

  const change = (key: keyof Buyer, value: string) => {
    setBuyer((b) => ({ ...b, [key]: value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const found = validateBuyer(buyer);
    setErrors(found);
    const keys = Object.keys(found) as (keyof Buyer)[];
    if (keys.length) {
      form.querySelector<HTMLInputElement>(`[name="${keys[0]}"]`)?.focus();
      notify({
        tone: 'error',
        title: 'Teslimat bilgileri eksik',
        message: `Lütfen şu alanları kontrol ediniz: ${keys.map((k) => BUYER_LABELS[k]).join(', ')}.`,
      });
      return;
    }
    if (!agreed) {
      setAgreementError('Devam etmek için sözleşmeyi onaylayın');
      return;
    }
    setSubmitting(true);
    try {
      const payment = await startPayment(items, buyer, embedded ? 'app' : 'web');
      // Aynı pencerede (WebView içinde) iyzico 3D Secure sayfasına geçilir.
      window.location.assign(payment.paymentPageUrl);
    } catch (err) {
      setSubmitting(false);
      notify({
        tone: 'error',
        title: 'Ödeme başlatılamadı',
        message: toFriendlyMessage(
          err,
          'Ödeme sayfası açılamadı. Kartınızdan tutar çekilmedi; lütfen tekrar deneyiniz.',
        ),
      });
    }
  };

  return (
    <PageShell title="Güvenli Ödeme" embedded={embedded} width="wide">
      {submitting && (
        <div className="fixed inset-0 z-50">
          <SnoresisLoading variant="overlay" label="Güvenli ödeme sayfası açılıyor..." />
        </div>
      )}
      <PageHeading eyebrow="Güvenli ödeme" title="Siparişi Tamamla">
        <p className="flex items-center gap-1.5">
          <Lock size={14} className="shrink-0 text-emerald-600" /> 256-bit SSL · iyzico · 3D Secure
        </p>
      </PageHeading>

      {load.state === 'loading' && <SnoresisLoading label="Sipariş özeti hazırlanıyor..." />}

      {load.state === 'error' && (
        <div className="rounded-3xl border border-line bg-white p-6 text-center">
          <p className="font-semibold text-ink">Ödeme sayfası açılamadı</p>
          <p className="mt-1 text-sm text-slate-500">{load.message}</p>
          {!embedded && (
            <a href="/#urunler" className="btn-primary mt-5">
              Ürünlere Dön
            </a>
          )}
        </div>
      )}

      {load.state === 'ready' && (
        <form
          onSubmit={submit}
          noValidate
          // Mobilde 16px yazı: iOS/Android WebView odaklanınca sayfayı yakınlaştırmaz.
          className="grid min-w-0 gap-6 lg:grid-cols-[1fr_22rem] lg:items-start [&_input]:text-base sm:[&_input]:text-sm"
        >
          <div className="min-w-0 space-y-6">
            <div className="lg:hidden">
              <OrderSummary quote={load.quote} />
            </div>
            <fieldset className="min-w-0 rounded-3xl border border-line bg-white p-4 sm:p-6">
              <legend className="sr-only">Teslimat bilgileri</legend>
              <p className="mb-4 font-display font-semibold text-ink">Teslimat ve fatura bilgileri</p>
              <BuyerFields value={buyer} errors={errors} onChange={change} />
            </fieldset>
            <SecurePaymentNote />
            <AgreementCheck
              checked={agreed}
              error={agreementError}
              onChange={(v) => {
                setAgreed(v);
                if (v) setAgreementError(undefined);
              }}
            />
            <button type="submit" disabled={submitting} className="btn-primary w-full py-4 text-base lg:hidden">
              <Lock size={16} strokeWidth={2.4} /> Ödemeye Geç · {formatPrice(load.quote.total)}
            </button>
          </div>

          <div className="hidden space-y-4 lg:sticky lg:top-24 lg:block">
            <OrderSummary quote={load.quote} />
            <button type="submit" disabled={submitting} className="btn-primary w-full py-4 text-base">
              <Lock size={16} strokeWidth={2.4} /> Ödemeye Geç · {formatPrice(load.quote.total)}
            </button>
          </div>
        </form>
      )}
    </PageShell>
  );
};

export default PaymentPage;
