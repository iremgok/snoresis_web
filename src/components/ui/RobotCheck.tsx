import { useEffect, useRef, useState } from 'react';
import { Bot, Check } from 'lucide-react';

export type RobotCheckState = 'idle' | 'verifying' | 'verified';

interface Props {
  state: RobotCheckState;
  onChange: (state: RobotCheckState) => void;
  error?: string;
}

/**
 * "Ben robot değilim" doğrulaması.
 * Yalnızca istemci tarafında çalışan bir göstergedir; gerçek bot koruması için Cloudflare Turnstile veya
 * reCAPTCHA token'ını burada alıp sunucuda doğrulayın (onChange('verified') çağrısını token'a bağlayın).
 */
export const RobotCheck = ({ state, onChange, error }: Props) => {
  const timer = useRef(0);
  const [pointerSeen, setPointerSeen] = useState(false);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const verify = () => {
    if (state !== 'idle') return;
    onChange('verifying');
    // İnsan etkileşimi (fare/dokunma) görülmediyse doğrulama biraz daha uzun sürer
    timer.current = window.setTimeout(() => onChange('verified'), pointerSeen ? 650 : 1400);
  };

  return (
    <div>
      <div
        className={`flex items-center justify-between gap-4 rounded-xl border bg-paper py-3 pr-4 pl-3 transition ${
          error ? 'border-rose-400' : state === 'verified' ? 'border-emerald-300' : 'border-line'
        }`}
      >
        <button
          type="button"
          role="checkbox"
          name="captcha"
          aria-checked={state === 'verified'}
          aria-busy={state === 'verifying'}
          aria-invalid={!!error}
          onPointerDown={() => setPointerSeen(true)}
          onClick={verify}
          className="group flex cursor-pointer items-center gap-3 text-sm font-medium text-ink"
        >
          <span
            className={`grid h-7 w-7 place-items-center rounded-md border-2 transition ${
              state === 'verified'
                ? 'border-emerald-500 bg-emerald-500 text-white'
                : state === 'verifying'
                  ? 'border-transparent'
                  : 'border-slate-300 bg-white group-hover:border-slate-400'
            }`}
          >
            {state === 'verifying' && (
              <span className="h-6 w-6 animate-spin rounded-full border-[3px] border-brand/20 border-t-brand" />
            )}
            {state === 'verified' && <Check size={17} strokeWidth={3.5} className="animate-pop" />}
          </span>
          {state === 'verified' ? 'Doğrulandı' : 'Ben robot değilim'}
        </button>
        <span
          aria-hidden="true"
          className={`grid h-9 w-9 place-items-center rounded-full transition ${
            state === 'verified' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-100 text-slate-400'
          }`}
        >
          <Bot size={19} strokeWidth={2} />
        </span>
      </div>
      {error && <span className="mt-1 block text-xs text-rose-500">{error}</span>}
    </div>
  );
};
