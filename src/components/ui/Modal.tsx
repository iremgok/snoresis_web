import { useEffect, useId, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface Props {
  title: string;
  onClose: () => void;
  children: ReactNode;
  /** 'center' için ortada kart, 'side' için sağdan açılan panel */
  variant?: 'center' | 'side';
  hideTitle?: boolean;
  /** Başlığın altında küçük açıklama satırı */
  subtitle?: ReactNode;
}

// Açık modalların yığını: Escape yalnızca en üsttekini kapatır (ör. ödeme üzerinde açılan sözleşme),
// sayfa kaydırması da son modal kapanana kadar kilitli kalır.
const stack: string[] = [];

const lockScroll = () => {
  if (stack.length !== 1) return;
  const gap = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = 'hidden';
  // Kaydırma çubuğu kaybolunca içeriğin sağa kaymasını önler
  if (gap > 0) document.body.style.paddingRight = `${gap}px`;
};

const unlockScroll = () => {
  if (stack.length !== 0) return;
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
};

export const Modal = ({ title, onClose, children, variant = 'center', hideTitle = false, subtitle }: Props) => {
  const id = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    stack.push(id);
    lockScroll();
    const prevFocus = document.activeElement as HTMLElement | null;
    panelRef.current?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && stack[stack.length - 1] === id) {
        e.stopPropagation();
        closeRef.current();
      }
    };
    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('keydown', onKey);
      stack.splice(stack.indexOf(id), 1);
      unlockScroll();
      prevFocus?.focus?.({ preventScroll: true });
    };
  }, [id]);

  const side = variant === 'side';

  return (
    <div
      className={`fixed inset-0 z-50 flex overscroll-contain ${side ? 'justify-end' : 'items-end justify-center sm:items-center sm:p-4'}`}
    >
      {/* Arka plan dokunmatik/touchpad kaydırmayı sayfaya iletmez */}
      <div className="animate-fade-in absolute inset-0 touch-none bg-ink/50 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={`relative flex flex-col overscroll-contain bg-white shadow-lift outline-none ${
          side
            ? 'animate-slide-in h-full w-full max-w-md'
            : 'animate-rise max-h-[92dvh] w-full max-w-lg rounded-t-[1.75rem] sm:rounded-[1.75rem]'
        }`}
      >
        <div
          className={`flex shrink-0 items-start justify-between gap-4 px-6 pt-5 ${hideTitle ? 'absolute inset-x-0 top-0 z-10' : 'pb-4'}`}
        >
          {!hideTitle && (
            <div className="min-w-0 pt-1">
              <h2 className="text-xl font-bold text-ink">{title}</h2>
              {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
            </div>
          )}
          <button
            type="button"
            onClick={onClose}
            className="ml-auto grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full text-slate-500 transition hover:bg-mist hover:text-ink"
            aria-label="Kapat"
          >
            <X size={19} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
