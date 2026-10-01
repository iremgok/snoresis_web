import { CircleAlert, CircleCheck, Info, X, type LucideIcon } from 'lucide-react';
import type { Toast, ToastTone } from '../../context/toast';

const TONES: Record<ToastTone, { icon: LucideIcon; accent: string }> = {
  error: { icon: CircleAlert, accent: 'bg-rose-500/10 text-rose-500' },
  success: { icon: CircleCheck, accent: 'bg-emerald-500/10 text-emerald-600' },
  info: { icon: Info, accent: 'bg-brand/10 text-brand' },
};

export const Toaster = ({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) => (
  <div
    aria-live="assertive"
    className="pointer-events-none fixed inset-x-4 top-20 z-[70] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:items-end lg:top-24"
  >
    {toasts.map(({ id, tone, title, message }) => {
      const { icon: Icon, accent } = TONES[tone];
      return (
        <div
          key={id}
          role={tone === 'error' ? 'alert' : 'status'}
          className="animate-rise pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-white/70 bg-white/90 p-3.5 pr-2.5 shadow-lift backdrop-blur-xl"
        >
          <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${accent}`}>
            <Icon size={18} strokeWidth={2.4} />
          </span>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="font-display text-sm font-semibold text-ink">{title}</p>
            {message && <p className="mt-0.5 text-[0.82rem] leading-snug text-slate-600">{message}</p>}
          </div>
          <button
            type="button"
            onClick={() => onDismiss(id)}
            className="grid h-7 w-7 shrink-0 cursor-pointer place-items-center rounded-full text-slate-400 transition hover:bg-mist hover:text-ink"
            aria-label="Bildirimi kapat"
          >
            <X size={15} />
          </button>
        </div>
      );
    })}
  </div>
);
