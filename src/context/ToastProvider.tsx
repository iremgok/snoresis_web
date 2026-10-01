import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { toFriendlyMessage } from '../lib/errors';
import { Toaster } from '../components/ui/Toaster';
import { ToastContext, type Toast, type ToastContextValue } from './toast';

const DURATION_MS = 6000;
const MAX_VISIBLE = 3;
// Tarayıcıların zararsız iç uyarıları; kullanıcıya gösterilmez
const IGNORED = /ResizeObserver loop|Script error\.?$/i;

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);
  const timers = useRef(new Map<number, number>());

  const dismiss = useCallback((id: number) => {
    window.clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setToasts((ts) => ts.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback<ToastContextValue['notify']>(
    (toast) => {
      const id = nextId.current++;
      setToasts((ts) => {
        // aynı bildirimi üst üste yığmak yerine tazele
        const rest = ts.filter((t) => t.title !== toast.title || t.message !== toast.message);
        return [...rest, { ...toast, id }].slice(-MAX_VISIBLE);
      });
      timers.current.set(id, window.setTimeout(() => dismiss(id), DURATION_MS));
    },
    [dismiss],
  );

  const notifyError = useCallback<ToastContextValue['notifyError']>(
    (err, title, fallback) => {
      if (import.meta.env.DEV) console.error(err);
      notify({ tone: 'error', title, message: toFriendlyMessage(err, fallback) });
    },
    [notify],
  );

  // Yakalanmamış hatalar: kullanıcı boş/donmuş ekran yerine anlaşılır bir bildirim görür
  useEffect(() => {
    const generic = (err: unknown) =>
      notifyError(err, 'Bir sorun oluştu', 'Beklenmeyen bir hata oluştu. Sayfayı yenileyip tekrar deneyiniz.');
    const onError = (e: ErrorEvent) => {
      if (!IGNORED.test(e.message)) generic(e.error ?? e.message);
    };
    const onRejection = (e: PromiseRejectionEvent) => generic(e.reason);
    const onOffline = () =>
      notify({
        tone: 'error',
        title: 'Bağlantı kesildi',
        message: 'İnternet bağlantınız kesildi. Gönderimler bağlantı gelene kadar tamamlanamaz.',
      });
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
      window.removeEventListener('offline', onOffline);
    };
  }, [notify, notifyError]);

  useEffect(() => {
    const map = timers.current;
    return () => map.forEach((t) => window.clearTimeout(t));
  }, []);

  const value = useMemo(() => ({ notify, notifyError, dismiss }), [notify, notifyError, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};
