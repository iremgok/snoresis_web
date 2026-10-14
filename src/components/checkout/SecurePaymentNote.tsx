import { ShieldCheck } from 'lucide-react';
import { PaymentLogos, SecurityBadges } from '../ui/PaymentBadges';

/** iyzico + 3D Secure açıklaması; kart bilgisinin Snoresis'e hiç ulaşmadığını belirtir. */
export const SecurePaymentNote = () => (
  <div className="rounded-2xl border border-line bg-paper p-4">
    <div className="flex items-start gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600">
        <ShieldCheck size={18} strokeWidth={2.3} />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-ink">iyzico ve 3D Secure ile korunan ödeme</p>
        <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
          Devam ettiğinizde lisanslı ödeme kuruluşu iyzico'nun güvenli sayfasına geçersiniz. Kart bilgilerinizi orada
          girer, bankanızın SMS kodu ile 3D Secure doğrulamasını tamamlarsınız. Bağlantı 256-bit SSL ile şifrelenir;
          kart bilgileriniz Snoresis'e hiç ulaşmaz ve saklanmaz.
        </p>
      </div>
    </div>
    <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3.5">
      <SecurityBadges />
      <PaymentLogos />
    </div>
  </div>
);
