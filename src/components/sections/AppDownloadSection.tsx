import { FileText } from 'lucide-react';
import { SoundwaveMesh } from '../ui/SoundwaveMesh';
import { StoreBadges } from '../ui/StoreBadges';

const PhoneMock = () => (
  <div className="relative mx-auto w-[230px] rotate-[4deg] rounded-[2.4rem] border-[7px] border-[#11182a] bg-[#0b1526] p-4 pt-8 text-white shadow-[0_40px_80px_-30px_rgb(0_0_0/0.6)]">
    <div className="absolute top-2.5 left-1/2 h-4 w-16 -translate-x-1/2 rounded-full bg-black" />
    <p className="text-[0.65rem] text-white/50">Dün gece</p>
    <p className="font-display text-lg font-semibold">Uyku özeti</p>

    <div className="relative mx-auto my-4 grid h-32 w-32 place-items-center">
      <svg viewBox="0 0 120 120" className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle cx="60" cy="60" r="50" fill="none" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke="url(#app-score)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${0.84 * 314} 314`}
        />
        <defs>
          <linearGradient id="app-score">
            <stop offset="0" stopColor="#7b3ff2" />
            <stop offset="1" stopColor="#0066ff" />
          </linearGradient>
        </defs>
      </svg>
      <div className="text-center">
        <p className="font-display text-3xl font-bold tabular-nums">84</p>
        <p className="text-[0.6rem] text-white/50">uyku skoru</p>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-2 text-[0.65rem]">
      {[
        ['SpO₂ ort.', '%96'],
        ['Nabız', '59 bpm'],
        ['Apne olayı', '2'],
        ['Süre', '7s 12dk'],
      ].map(([k, v]) => (
        <div key={k} className="rounded-xl bg-white/[0.06] p-2">
          <p className="text-white/50">{k}</p>
          <p className="font-display text-sm font-semibold">{v}</p>
        </div>
      ))}
    </div>
    <div className="mt-2 flex items-center gap-2 rounded-xl bg-brand p-2 text-[0.65rem] font-semibold">
      <FileText size={12} /> Raporu PDF olarak paylaş
    </div>
  </div>
);

export const AppDownloadSection = () => (
  <section id="uygulama" className="py-24 md:py-32" aria-labelledby="app-title">
    <div className="container-x">
      <div className="relative isolate grid items-center gap-12 overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-[#0b2a6b] via-brand to-[#5b3df0] px-6 py-14 text-white sm:px-12 md:grid-cols-[1.2fr_1fr] md:py-16 lg:px-16">
        <SoundwaveMesh className="-z-10 text-white opacity-[0.08]" />
        <div className="absolute -top-24 -right-24 -z-10 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
        <div>
          <span className="eyebrow text-sky-200 normal-case tracking-[0.12em]">iOS & Android</span>
          <h2 id="app-title" className="section-title">
            Snoresis AI Mobil Uygulamasını İndirin
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-blue-100/85">
            Sağlığınızı her an cebinizden takip edin. iOS ve Android cihazlarınızla tam uyumlu.
          </p>
          <div className="mt-9">
            <StoreBadges />
          </div>
        </div>
        <PhoneMock />
      </div>
    </div>
  </section>
);
