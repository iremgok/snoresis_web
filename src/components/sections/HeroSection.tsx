import { ArrowRight, HeartPulse, Wind } from 'lucide-react';
import { scrollToSection } from '../../lib/format';
import { Hypnogram } from '../ui/Hypnogram';
import { SoundwaveMesh } from '../ui/SoundwaveMesh';

// Nefes ritmi: düzenli dalga, ortada kısa bir duraksama (apne) ve toparlanma.
const breathPath = (() => {
  const pts: string[] = [];
  for (let x = 0; x <= 320; x += 2) {
    const pause = x > 150 && x < 200;
    const recovery = x >= 200 && x < 230 ? 1.6 : 1;
    const y = pause ? 40 + Math.sin(x * 0.5) * 1.2 : 40 + Math.sin(x * 0.11) * 18 * recovery;
    pts.push(`${x},${y.toFixed(1)}`);
  }
  return `M${pts.join(' L')}`;
})();

const HeroVisual = () => (
  <div className="relative mx-auto aspect-square w-full max-w-[460px]">
    {/* halkalar */}
    <div className="absolute inset-0 rounded-full border border-white/10" />
    <div className="absolute inset-[11%] rounded-full border border-white/10" />
    <div className="absolute inset-[22%] animate-breathe rounded-full bg-gradient-to-br from-brand/50 via-violet/30 to-transparent blur-2xl blob" />

    <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="hero-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.5" stopColor="#b9c8e6" />
          <stop offset="1" stopColor="#4a5e86" />
        </linearGradient>
        <radialGradient id="hero-glow">
          <stop offset="0" stopColor="#4d8dff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#4d8dff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* yüzük */}
      <circle cx="200" cy="215" r="110" fill="url(#hero-glow)" opacity="0.35" />
      <ellipse cx="200" cy="222" rx="78" ry="80" fill="none" stroke="#1d3563" strokeWidth="26" />
      <ellipse cx="200" cy="214" rx="78" ry="80" fill="none" stroke="url(#hero-ring)" strokeWidth="24" />
      <path d="M140 170 A78 80 0 0 1 214 134.5" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
      <rect x="182" y="284" width="36" height="11" rx="5.5" fill="#22324f" />
      <circle cx="192" cy="289.5" r="2.5" fill="#ff4d6d" />
      <circle cx="208" cy="289.5" r="2.5" fill="#4dd6ff" />
    </svg>

    {/* uyku evreleri kartı */}
    <div className="absolute top-0 right-0 w-[68%] rounded-2xl border border-white/15 bg-white/[0.07] p-3.5 backdrop-blur-md sm:w-[50%]">
      <div className="mb-2 flex items-center justify-between text-[0.7rem] font-semibold tracking-wider text-white/60 uppercase">
        <span>Uyku evreleri</span>
        <span className="hidden tracking-normal text-white/45 normal-case tabular-nums sm:inline">23:40 – 06:52</span>
      </div>
      <Hypnogram className="h-12 w-full" showLegend />
    </div>

    {/* nefes kartı */}
    <div className="absolute right-0 bottom-[6%] left-[8%] rounded-2xl border border-white/15 bg-white/[0.07] p-4 backdrop-blur-md sm:left-[18%]">
      <div className="mb-1 flex items-center justify-between text-[0.7rem] font-semibold tracking-wider text-white/60 uppercase">
        <span className="flex items-center gap-1.5">
          <Wind size={13} /> Nefes ritmi
        </span>
        <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-amber-300">03:42 · duraksama</span>
      </div>
      <svg viewBox="0 0 320 80" className="h-14 w-full" aria-hidden="true">
        <rect x="150" y="6" width="50" height="68" rx="6" fill="#fbbf24" fillOpacity="0.08" stroke="#fbbf24" strokeOpacity="0.55" strokeDasharray="3 3" />
        <path d={breathPath} fill="none" stroke="#ffffff" strokeOpacity="0.18" strokeWidth="2" />
        <path
          d={breathPath}
          fill="none"
          stroke="#7fb2ff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="60 180"
          className="animate-wave"
        />
      </svg>
    </div>

    {/* metrik çipleri */}
    <div className="absolute top-[28%] left-0 flex items-center gap-2.5 rounded-2xl border border-white/15 bg-white/[0.08] py-2.5 pr-4 pl-2.5 text-white backdrop-blur-md">
      <span className="grid h-8 w-8 place-items-center rounded-xl bg-sky-400/20 font-display text-[0.65rem] font-bold text-sky-200">
        O₂
      </span>
      <span className="leading-tight">
        <span className="block text-[0.65rem] text-white/60">SpO₂</span>
        <span className="font-display text-lg font-semibold tabular-nums">%97</span>
      </span>
    </div>
    <div className="absolute top-[44%] right-0 flex items-center gap-2.5 rounded-2xl border border-white/15 bg-white/[0.08] py-2.5 pr-4 pl-2.5 text-white backdrop-blur-md">
      <span className="grid h-8 w-8 place-items-center rounded-xl bg-rose-400/20 text-rose-200">
        <HeartPulse size={16} />
      </span>
      <span className="leading-tight">
        <span className="block text-[0.65rem] text-white/60">Nabız</span>
        <span className="font-display text-lg font-semibold tabular-nums">
          58 <span className="text-xs font-medium text-white/60">bpm</span>
        </span>
      </span>
    </div>
  </div>
);

export const HeroSection = () => (
  <section
    id="top"
    className="relative isolate overflow-hidden bg-[radial-gradient(120%_90%_at_85%_10%,#0066FF_0%,#0b3a8f_35%,#0A192F_75%)] pt-28 pb-24 text-white md:pt-36 md:pb-32"
  >
    <div className="absolute -top-40 -left-32 -z-10 h-[28rem] w-[28rem] animate-drift rounded-full bg-violet/25 blur-3xl blob" />
    <div className="absolute right-[-10%] bottom-[-30%] -z-10 h-[30rem] w-[30rem] rounded-full bg-brand/30 blur-3xl blob" />
    <SoundwaveMesh className="-z-10 text-white opacity-[0.04]" />

    <div className="container-x grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
      <div className="max-w-xl">
        <span className="eyebrow mb-6 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sky-200">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          Yapay zeka destekli uyku sağlığı
        </span>
        <h1 className="text-[2.6rem] leading-[1.02] font-bold sm:text-6xl lg:text-[4.2rem]">
          Uykunuzun Kontrolü{' '}
          <span className="bg-gradient-to-r from-sky-200 via-white to-violet-200 bg-clip-text text-transparent">
            Artık Sizde
          </span>
        </h1>
        <p className="mt-6 max-w-lg text-lg leading-relaxed text-blue-100/80">
          Snoresis ile horlama ve uyku apnesini teknolojinin gücüyle kontrol edin. Daha kaliteli uykular için gelişmiş
          çözümler.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <button type="button" onClick={() => scrollToSection('urunler')} className="btn-primary group px-7 py-3.5">
            Ürünleri Keşfet
            <ArrowRight size={17} className="transition group-hover:translate-x-0.5" />
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('ozellikler')}
            className="btn border border-white/25 px-7 py-3.5 text-white hover:border-white/60 hover:bg-white/5"
          >
            Daha Fazla Bilgi
          </button>
        </div>
      </div>

      <HeroVisual />
    </div>

    {/* alt kenar kıvrımı */}
    <svg
      className="absolute inset-x-0 -bottom-px h-10 w-full text-paper md:h-16"
      viewBox="0 0 1440 64"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d="M0 64 V40 C240 8 480 0 720 18 C960 36 1200 40 1440 12 V64 Z" fill="currentColor" />
    </svg>
  </section>
);
