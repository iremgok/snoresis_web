import { Lock, ShieldCheck } from 'lucide-react';

// Logolar sade SVG çizimlerdir; ödeme kuruluşlarınızın marka kılavuzundaki resmi dosyalarla değiştirilebilir.

const Visa = () => (
  <svg viewBox="0 0 48 16" className="h-3.5 w-auto" aria-hidden="true">
    <text x="24" y="13.5" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="15" fontWeight="900" fontStyle="italic" fill="#1A1F71" letterSpacing="-0.5">
      VISA
    </text>
  </svg>
);

const Mastercard = () => (
  <svg viewBox="0 0 32 20" className="h-5 w-auto" aria-hidden="true">
    <circle cx="12" cy="10" r="8" fill="#EB001B" />
    <circle cx="20" cy="10" r="8" fill="#F79E1B" />
    <path d="M16 3.07a8 8 0 0 1 0 13.86 8 8 0 0 1 0-13.86Z" fill="#FF5F00" />
  </svg>
);

const Troy = () => (
  <svg viewBox="0 0 44 16" className="h-3.5 w-auto" aria-hidden="true">
    <text x="22" y="13" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="800" fill="#00A0AF" letterSpacing="0.5">
      TROY
    </text>
  </svg>
);

const Iyzico = () => (
  <svg viewBox="0 0 46 16" className="h-3.5 w-auto" aria-hidden="true">
    <text x="23" y="12.5" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="700" fill="#1E64FF">
      iyzico
    </text>
  </svg>
);

const PayTR = () => (
  <svg viewBox="0 0 46 16" className="h-3.5 w-auto" aria-hidden="true">
    <text x="23" y="13" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="800" fill="#0B2A4A">
      Pay<tspan fill="#2CB34A">TR</tspan>
    </text>
  </svg>
);

const LOGOS = [
  { name: 'iyzico', Logo: Iyzico },
  { name: 'PayTR', Logo: PayTR },
  { name: 'Visa', Logo: Visa },
  { name: 'Mastercard', Logo: Mastercard },
  { name: 'TROY', Logo: Troy },
];

/** Ödeme altyapısı ve kart logoları. `tone="dark"` koyu zeminde (footer) kullanılır. */
export const PaymentLogos = ({ tone = 'light', className = '' }: { tone?: 'light' | 'dark'; className?: string }) => (
  <ul className={`flex flex-wrap items-center gap-1.5 ${className}`} aria-label="Kabul edilen ödeme yöntemleri">
    {LOGOS.map(({ name, Logo }) => (
      <li
        key={name}
        title={name}
        className={`grid h-8 min-w-12 place-items-center rounded-lg px-2 ${
          tone === 'dark' ? 'bg-white' : 'border border-line bg-white'
        }`}
      >
        <Logo />
        <span className="sr-only">{name}</span>
      </li>
    ))}
  </ul>
);

/** 256-bit SSL ve 3D Secure güven rozetleri */
export const SecurityBadges = ({ tone = 'light', className = '' }: { tone?: 'light' | 'dark'; className?: string }) => {
  const badge =
    tone === 'dark'
      ? 'border-white/15 bg-white/5 text-white/80'
      : 'border-emerald-200 bg-emerald-50 text-emerald-800';
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${badge}`}>
        <Lock size={13} strokeWidth={2.4} /> 256-bit SSL
      </span>
      <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${badge}`}>
        <ShieldCheck size={14} strokeWidth={2.4} /> 3D Secure
      </span>
    </div>
  );
};
