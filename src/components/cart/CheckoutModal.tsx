import { useState, type FormEvent } from 'react';
import { ArrowLeft, Lock, Truck } from 'lucide-react';
import { useCart } from '../../context/cart';
import { useToast } from '../../context/toast';
import { toFriendlyMessage } from '../../lib/errors';
import { formatPrice } from '../../lib/format';
import {
  BUYER_LABELS,
  EMPTY_BUYER,
  cartToItems,
  savePendingCheckout,
  startPayment,
  validateBuyer,
  type Buyer,
  type BuyerErrors,
} from '../../lib/payment';
import { AgreementCheck } from '../checkout/AgreementCheck';
import { BuyerFields } from '../checkout/BuyerFields';
import { SecurePaymentNote } from '../checkout/SecurePaymentNote';
import { Modal } from '../ui/Modal';
import { SnoresisLoading } from '../ui/SnoresisLoading';

export const CheckoutModal = () => {
  const { items, total, closePanel, openPanel } = useCart();
  const { notify } = useToast();
  const [agreed, setAgreed] = useState(false);
  const [agreementError, setAgreementError] = useState<string>();
  const [buyer, setBuyer] = useState<Buyer>(EMPTY_BUYER);
  const [errors, setErrors] = useState<BuyerErrors>({});
  const [submitting, setSubmitting] = useState(false);

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
        message: `Siparişinizi gönderebilmemiz için lütfen şu alanları kontrol ediniz: ${keys.map((k) => BUYER_LABELS[k]).join(', ')}.`,
      });
      return;
    }
    if (!agreed) {
      setAgreementError('Devam etmek için sözleşmeyi onaylayın');
      notify({
        tone: 'error',
        title: 'Sözleşme onayı gerekli',
        message: "Siparişi tamamlamak için Mesafeli Satış Sözleşmesi ve Ön Bilgilendirme Formu'nu onaylamanız gerekir.",
      });
      return;
    }

    setSubmitting(true);
    try {
      // Tutar sunucuda yeniden hesaplanır; buradaki `total` yalnızca gösterim içindir.
      const payment = await startPayment(cartToItems(items), buyer, 'web');
      savePendingCheckout({ orderId: payment.orderId, email: buyer.email.trim(), items, total: payment.total });
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

  const close = () => !submitting && closePanel();

  return (
    <Modal title="Ödeme" onClose={close}>
      {submitting && <SnoresisLoading variant="overlay" label="Güvenli ödeme sayfası açılıyor..." />}
      <form onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
        <div className="scroll-panel space-y-6 px-4 pb-6 sm:px-6">
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-mist px-4 py-3 text-sm">
            <span className="text-slate-500">
              {items.reduce((n, i) => n + i.quantity, 0)} ürün ·{' '}
              <button
                type="button"
                onClick={() => openPanel('cart')}
                className="cursor-pointer font-semibold text-brand"
              >
                sepeti düzenle
              </button>
            </span>
            <span className="font-display text-lg font-bold text-ink tabular-nums">{formatPrice(total)}</span>
          </div>

          <fieldset>
            <legend className="mb-3 flex w-full items-center justify-between gap-2 font-display font-semibold text-ink">
              Teslimat bilgileri
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
                <Truck size={13} strokeWidth={2.4} /> Ücretsiz kargo
              </span>
            </legend>
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
        </div>

        <div className="flex gap-2.5 border-t border-line bg-paper px-4 py-4 sm:px-6">
          <button
            type="button"
            onClick={() => openPanel('cart')}
            disabled={submitting}
            className="btn-ghost px-4"
            aria-label="Sepete dön"
          >
            <ArrowLeft size={17} />
          </button>
          <button type="submit" disabled={submitting} className="btn-primary min-w-0 flex-1 py-3.5">
            {submitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Yönlendiriliyor…
              </>
            ) : (
              <>
                <Lock size={15} strokeWidth={2.4} className="shrink-0" />
                <span className="truncate">Güvenli Ödemeye Geç · {formatPrice(total)}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
