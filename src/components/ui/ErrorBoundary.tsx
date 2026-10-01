import { Component, type ErrorInfo, type ReactNode } from 'react';
import { RotateCw } from 'lucide-react';
import { Emblem } from './Emblem';

// Çizim sırasında oluşan bir hata, boş beyaz sayfa yerine anlaşılır bir ekran gösterir.
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) console.error(error, info.componentStack);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div role="alert" className="grid min-h-dvh place-items-center bg-paper px-6 text-center">
        <div className="max-w-sm">
          <Emblem size={56} className="mx-auto" />
          <h1 className="mt-6 text-2xl font-bold text-ink">Sayfa yüklenemedi</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Beklenmeyen bir sorun oluştu. Sayfayı yenilemek çoğu zaman sorunu çözer; devam ederse bize ulaşın.
          </p>
          <button type="button" onClick={() => window.location.reload()} className="btn-primary mt-6">
            <RotateCw size={16} /> Sayfayı yenile
          </button>
        </div>
      </div>
    );
  }
}
