import { useState } from 'react';
import { Cookie } from 'lucide-react';
import type { CookieCategory, CookieConsent } from '../../types';

type Mode = 'summary' | 'preferences';
type Choice = Pick<CookieConsent, 'analytics' | 'marketing'>;

const CATEGORIES: { key: CookieCategory; title: string; text: string }[] = [
  { key: 'necessary', title: 'Zorunlu', text: 'Sepet, ödeme ve güvenlik için gereklidir; kapatılamaz.' },
  { key: 'analytics', title: 'Analitik', text: 'Siteyi nasıl kullandığınızı anonim olarak ölçer.' },
  { key: 'marketing', title: 'Pazarlama', text: 'Size uygun kampanyaları göstermemize yardımcı olur.' },
];

const Switch = ({ checked, disabled, onChange, label }: { checked: boolean; disabled?: boolean; onChange?: () => void; label: string }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    disabled={disabled}
    onClick={onChange}
    className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition disabled:cursor-not-allowed ${
      checked ? 'bg-brand' : 'bg-slate-300'
    } ${disabled ? 'opacity-60' : ''}`}
  >
    <span
      className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : ''}`}
    />
  </button>
);

interface Props {
  mode: Mode;
  initial: CookieConsent | null;
  onModeChange: (m: Mode) => void;
  onSave: (choice: Choice) => void;
  onOpenPolicy: () => void;
}

export const CookieBanner = ({ mode, initial, onModeChange, onSave, onOpenPolicy }: Props) => {
  const [choice, setChoice] = useState<Choice>({
    analytics: initial?.analytics ?? false,
    marketing: initial?.marketing ?? false,
  });

  const policyLink = (
    <button type="button" onClick={onOpenPolicy} className="cursor-pointer font-semibold text-brand underline-offset-2 hover:underline">
      Çerez Politikası
    </button>
  );

  return (
    <div
      role="region"
      aria-label="Çerez tercihleri"
      className="animate-rise fixed inset-x-2 bottom-[max(0.5rem,env(safe-area-inset-bottom))] z-[45] sm:inset-x-auto sm:right-6 sm:bottom-6 sm:left-6 lg:left-auto lg:max-w-xl"
    >
      {/* Mobilde ekranın altında kompakt bant; sm ve üzerinde önceki kart görünümü */}
      <div className="rounded-2xl border border-line bg-white/95 p-3.5 shadow-lift backdrop-blur-xl sm:rounded-3xl sm:p-6">
        <div className="flex items-start gap-3.5">
          <span className="hidden h-10 w-10 shrink-0 sm:grid place-items-center rounded-xl bg-brand/10 text-brand">
            <Cookie size={20} />
          </span>
          <div className="min-w-0">
            <p className="font-display text-sm font-semibold text-ink sm:text-base">Çerezleri kullanıyoruz</p>
            <p className="mt-0.5 text-xs leading-snug text-slate-600 sm:mt-1 sm:text-[0.82rem] sm:leading-relaxed">
              <span className="sm:hidden">
                Zorunlu çerezler sepet ve ödeme içindir; analitik ve pazarlama çerezleri yalnızca onayınızla çalışır.
              </span>
              <span className="hidden sm:inline">
                Sepetinizi hatırlamak ve ödemeyi güvenle tamamlamak için zorunlu çerezler kullanıyoruz. Analitik ve
                pazarlama çerezleri ise yalnızca onayınızla çalışır.
              </span>{' '}
              Ayrıntılar için {policyLink}.
            </p>
          </div>
        </div>

        {mode === 'preferences' && (
          <ul className="mt-3 max-h-[38dvh] divide-y sm:mt-4 sm:max-h-[40dvh] divide-line overflow-y-auto overscroll-contain rounded-2xl border border-line">
            {CATEGORIES.map(({ key, title, text }) => {
              const necessary = key === 'necessary';
              const checked = necessary || choice[key as keyof Choice];
              return (
                <li key={key} className="flex items-center justify-between gap-3 px-3 py-2.5 sm:gap-4 sm:px-4 sm:py-3">
                  <div>
                    <p className="text-sm font-semibold text-ink">{title}</p>
                    <p className="text-xs text-slate-500">{text}</p>
                  </div>
                  <Switch
                    label={`${title} çerezleri`}
                    checked={checked}
                    disabled={necessary}
                    onChange={necessary ? undefined : () => setChoice((c) => ({ ...c, [key]: !c[key as keyof Choice] }))}
                  />
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-3 flex gap-2 sm:mt-4 sm:justify-end">
          {mode === 'summary' ? (
            <button type="button" onClick={() => onModeChange('preferences')} className="btn-ghost flex-1 px-3 py-2 text-xs sm:flex-none sm:px-6 sm:py-2.5 sm:text-sm">
              Tercihleri Yönet
            </button>
          ) : (
            <button type="button" onClick={() => onSave(choice)} className="btn-ghost flex-1 px-3 py-2 text-xs sm:flex-none sm:px-6 sm:py-2.5 sm:text-sm">
              Seçimleri Kaydet
            </button>
          )}
          <button type="button" onClick={() => onSave({ analytics: true, marketing: true })} className="btn-primary flex-1 px-3 py-2 text-xs sm:flex-none sm:px-6 sm:py-2.5 sm:text-sm">
            Tümünü Kabul Et
          </button>
        </div>
      </div>
    </div>
  );
};
