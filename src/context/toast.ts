import { createContext, useContext } from 'react';

export type ToastTone = 'error' | 'success' | 'info';

export interface Toast {
  id: number;
  tone: ToastTone;
  title: string;
  message?: string;
}

export interface ToastContextValue {
  notify: (toast: Omit<Toast, 'id'>) => void;
  /** Ham hatayı kullanıcı dostu bir hata bildirimine çevirir. */
  notifyError: (err: unknown, title: string, fallback: string) => void;
  dismiss: (id: number) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
