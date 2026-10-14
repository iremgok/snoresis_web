import { useEffect, type ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { MEDICAL_DISCLAIMER } from '../../data/legal';
import { SITE } from '../../data/site';
import { Logo } from '../ui/Emblem';

interface Props {
  /** Sekme başlığı */
  title: string;
  children: ReactNode;
  /** Mobil uygulamanın WebView'inde: siteye dönüş bağlantıları gizlenir */
  embedded?: boolean;
  /** İçerik genişliği */
  width?: 'prose' | 'wide';
}

const YEAR = new Date().getFullYear();

/** /gizlilik, /hesap-silme ve /odeme gibi tek başına açılan sayfaların ortak çerçevesi. */
export const PageShell = ({ title, children, embedded = false, width = 'prose' }: Props) => {
  useEffect(() => {
    document.title = `${title} — Snoresis AI`;
  }, [title]);

  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <header className="sticky top-0 z-30 border-b border-line/80 bg-white/90 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
        <div className="container-x flex h-14 items-center justify-between gap-3 sm:h-16">
          {embedded ? (
            <Logo />
          ) : (
            <a href="/" aria-label="Snoresis AI ana sayfa" className="min-w-0">
              <Logo />
            </a>
          )}
          {!embedded && (
            <a
              href="/"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-mist hover:text-ink sm:text-sm"
            >
              <ArrowLeft size={15} /> Ana sayfa
            </a>
          )}
        </div>
      </header>

      <main
        className={`container-x flex-1 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] sm:py-12 ${width === 'prose' ? 'max-w-3xl' : 'max-w-5xl'}`}
      >
        {children}
      </main>

      {!embedded && (
        <footer className="border-t border-line bg-white">
          <div className="container-x flex flex-col gap-3 py-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
            <p className="max-w-xl leading-relaxed">{MEDICAL_DISCLAIMER}</p>
            <nav aria-label="Yasal" className="flex flex-wrap gap-x-4 gap-y-1.5 font-semibold">
              <a href="/gizlilik" className="hover:text-brand">
                Gizlilik Politikası
              </a>
              <a href="/hesap-silme" className="hover:text-brand">
                Hesap Silme
              </a>
              <a href={`mailto:${SITE.email}`} className="hover:text-brand">
                {SITE.email}
              </a>
            </nav>
          </div>
          <p className="container-x pb-5 text-xs text-slate-400">© {YEAR} Snoresis AI A.Ş. Tüm hakları saklıdır.</p>
        </footer>
      )}
    </div>
  );
};

/** Sayfa başlığı bloğu */
export const PageHeading = ({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
}) => (
  <div className="mb-8 sm:mb-10">
    {eyebrow && <span className="eyebrow text-brand">{eyebrow}</span>}
    <h1 className="mt-3 text-[clamp(1.75rem,7vw,2.5rem)] leading-[1.1] font-bold text-ink">{title}</h1>
    {children && <div className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">{children}</div>}
  </div>
);
