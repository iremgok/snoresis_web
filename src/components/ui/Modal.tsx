import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface Props {
  title: string;
  onClose: () => void;
  children: ReactNode;
  /** 'center' için ortada kart, 'side' için sağdan açılan panel */
  variant?: 'center' | 'side';
  hideTitle?: boolean;
}

export const Modal = ({ title, onClose, children, variant = 'center', hideTitle = false }: Props) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    return () => prevFocus?.focus?.();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const side = variant === 'side';

  return (
    <div className={`fixed inset-0 z-50 flex ${side ? 'justify-end' : 'items-end justify-center sm:items-center sm:p-4'}`}>
      <div className="animate-fade-in absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={`relative flex flex-col bg-white shadow-lift outline-none ${
          side
            ? 'animate-slide-in h-full w-full max-w-md'
            : 'animate-rise max-h-[92dvh] w-full max-w-lg rounded-t-[1.75rem] sm:rounded-[1.75rem]'
        }`}
      >
        <div className={`flex items-center justify-between px-6 pt-5 ${hideTitle ? 'absolute inset-x-0 top-0 z-10' : 'pb-4'}`}>
          {!hideTitle && <h2 className="text-xl font-bold text-ink">{title}</h2>}
          <button
            type="button"
            onClick={onClose}
            className="ml-auto grid h-9 w-9 cursor-pointer place-items-center rounded-full text-slate-500 transition hover:bg-mist hover:text-ink"
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
