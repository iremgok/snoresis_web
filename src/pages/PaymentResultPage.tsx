import { useEffect, useState } from 'react';
import { CircleCheck, CircleX, FileText, Truck } from 'lucide-react';
import { PageShell } from '../components/layout/PageShell';
import { useCart } from '../context/cart';
import { useLegal } from '../context/legal';
import { formatPrice } from '../lib/format';
import { recordOrder } from '../lib/orders';
import { clearPendingCheckout, readPendingCheckout } from '../lib/payment';
import { isEmbedded } from '../lib/route';

// /odeme/basarili ve /odeme/basarisiz — /api/payment/callback buraya yönlendirir.
// Mobil uygulama bu adreslere gidişi yakalayıp WebView'i kapatır; sayfa tarayıcıdaki
// kullanıcılar (ve WebView kapanana kadar geçen an) için gösterilir.

const params = () => new URLSearchParams(window.location.search);

const REASONS: Record<string, string> = {
  declined: 'Ödeme bankanız veya 3D Secure doğrulaması tarafından onaylanmadı.',
  amount_mismatch:
    'Ödeme tutarı doğrulanamadı; işlem güvenlik nedeniyle iptal edildi; çekilen tutar kartınıza iade edilir.',
  gateway_error: 'Ödeme sağlayıcısından yanıt alınamadı.',
  missing_token: 'Ödeme oturumu bulunamadı ya da süresi doldu.',
};

export const PaymentSuccessPage = () => {
  const embedded = isEmbedded();
  const { clear } = useCart();
  const { openPolicy } = useLegal();
  const orderId = params().get('order') ?? '';
  const total = Number(params().get('total')) || 0;
  const [email] = useState(() => (embedded ? null : (readPendingCheckout(orderId)?.email ?? null)));

  // Web'den gelen siparişte sepeti boşalt. Sipariş sunucuda (Supabase) kayıtlıdır; yerel kayıt yalnızca
  // API'siz geliştirme ortamındaki "Sipariş Takip" içindir. Kayıt hemen silindiği için yenilemede tekrarlanmaz.
  useEffect(() => {
    if (embedded) return;
    const pending = readPendingCheckout(orderId);
    if (!pending) return;
    clearPendingCheckout();
    recordOrder(orderId, pending.email, pending.items, total || pending.total);
    clear();
  }, [embedded, orderId, total, clear]);

  return (
    <PageShell title="Siparişiniz Alındı" embedded={embedded}>
      <div className="mx-auto max-w-md rounded-3xl border border-line bg-white px-5 py-10 text-center shadow-soft sm:px-8">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-500 text-white">
          <CircleCheck size={40} strokeWidth={2.2} />
        </span>
        <h1 className="mt-6 text-3xl font-bold text-ink">Siparişiniz Alındı!</h1>
        <p className="mt-2 text-sm text-slate-500">
          Ödemeniz 3D Secure ile onaylandı. Siparişinizi aşağıdaki sipariş numarası ve ödemede kullandığınız
          {email ? <span className="font-semibold text-ink"> {email}</span> : ' e-posta adresi'} ile{' '}
          <span className="font-semibold text-ink">Sipariş Takip</span> bölümünden izleyebilirsiniz. Lütfen sipariş
          numaranızı not alın.
        </p>
        <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand/10 px-3.5 py-1.5 text-xs font-semibold text-brand">
          <Truck size={14} /> Ücretsiz kargo · 24 saat içinde kargoda
        </p>
        {orderId && (
          <dl className="mt-6 space-y-2 rounded-2xl border border-line bg-paper p-4 text-left text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">Sipariş no</dt>
              <dd className="font-mono font-semibold text-ink">{orderId}</dd>
            </div>
            {total > 0 && (
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">Tutar</dt>
                <dd className="font-semibold text-ink tabular-nums">{formatPrice(total)}</dd>
              </div>
            )}
          </dl>
        )}
        <button
          type="button"
          onClick={() => openPolicy('distance-sales')}
          className="mt-4 inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
        >
          <FileText size={14} /> Mesafeli Satış Sözleşmesi’ni görüntüle
        </button>
        {!embedded && (
          <a href="/#siparis-takip" className="btn-primary mt-6 w-full py-3.5">
            Siparişimi Takip Et
          </a>
        )}
      </div>
    </PageShell>
  );
};

export const PaymentFailurePage = () => {
  const embedded = isEmbedded();
  const reason = REASONS[params().get('reason') ?? ''] ?? 'Ödeme tamamlanamadı.';
  return (
    <PageShell title="Ödeme Tamamlanamadı" embedded={embedded}>
      <div className="mx-auto max-w-md rounded-3xl border border-line bg-white px-5 py-10 text-center shadow-soft sm:px-8">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-rose-500 text-white">
          <CircleX size={40} strokeWidth={2.2} />
        </span>
        <h1 className="mt-6 text-3xl font-bold text-ink">Ödeme Tamamlanamadı</h1>
        <p className="mt-2 text-sm text-slate-500">{reason}</p>
        <p className="mt-1 text-sm text-slate-500">Sepetiniz korunuyor; dilediğiniz zaman tekrar deneyebilirsiniz.</p>
        {!embedded && (
          <a href="/#urunler" className="btn-primary mt-6 w-full py-3.5">
            Alışverişe Dön
          </a>
        )}
      </div>
    </PageShell>
  );
};
