import { SITE } from '../../data/site';

const Apple = () => (
  <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden="true">
    <path d="M16.37 12.75c.02 2.36 2.07 3.15 2.1 3.16-.02.06-.33 1.12-1.08 2.22-.65.95-1.32 1.89-2.38 1.91-1.04.02-1.38-.62-2.57-.62-1.2 0-1.57.6-2.56.64-1.02.04-1.8-1.03-2.46-1.97-1.34-1.95-2.37-5.5-.99-7.9.68-1.2 1.91-1.95 3.24-1.97 1.01-.02 1.97.68 2.59.68.62 0 1.78-.84 3-.72.51.02 1.95.21 2.87 1.56-.07.05-1.71 1-1.69 2.98M14.4 6.97c.55-.66.92-1.59.82-2.51-.79.03-1.75.53-2.32 1.19-.51.59-.95 1.53-.83 2.43.88.07 1.78-.45 2.33-1.11" />
  </svg>
);

const Play = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
    <path d="M4.2 2.6 13.5 12l-9.3 9.4c-.3-.2-.5-.6-.5-1.1V3.7c0-.5.2-.9.5-1.1Z" fill="#00d7fe" />
    <path d="m16.6 8.9-3.1 3.1-9.3-9.4c.3-.2.8-.2 1.3.1l11.1 6.2Z" fill="#00f076" />
    <path d="m16.6 15.1-11.1 6.2c-.5.3-1 .3-1.3.1l9.3-9.4 3.1 3.1Z" fill="#ff3a44" />
    <path d="m20.3 13.2-3.7 1.9-3.1-3.1 3.1-3.1 3.7 2c1 .6 1 1.8 0 2.3Z" fill="#ffd500" />
  </svg>
);

const badge =
  'inline-flex items-center gap-3 rounded-2xl border border-white/15 bg-black px-5 py-2.5 text-white transition hover:-translate-y-0.5 hover:border-white/40 hover:shadow-lift';

export const StoreBadges = () => (
  <div className="flex flex-wrap gap-3">
    <a href={SITE.appStoreUrl} target="_blank" rel="noopener noreferrer" className={badge}>
      <Apple />
      <span className="text-left leading-tight">
        <span className="block text-[0.68rem] text-white/70">App Store'dan</span>
        <span className="block font-display text-base font-semibold">İndirin</span>
      </span>
    </a>
    <a href={SITE.googlePlayUrl} target="_blank" rel="noopener noreferrer" className={badge}>
      <Play />
      <span className="text-left leading-tight">
        <span className="block text-[0.68rem] text-white/70">Google Play'den</span>
        <span className="block font-display text-base font-semibold">İndirin</span>
      </span>
    </a>
  </div>
);
