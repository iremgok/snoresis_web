import { IPhoneMockup } from '../ui/IPhoneMockup';
import { SoundwaveMesh } from '../ui/SoundwaveMesh';
import { StoreBadges } from '../ui/StoreBadges';

export const AppDownloadSection = () => (
  <section id="uygulama" className="py-12 sm:py-24 md:py-32" aria-labelledby="app-title">
    <div className="container-x">
      <div className="relative isolate grid items-center gap-7 overflow-hidden rounded-[1.75rem] sm:gap-12 sm:rounded-[2.25rem] bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-900 px-5 py-9 text-white sm:px-12 sm:py-14 md:grid-cols-[1.2fr_1fr] md:py-16 lg:px-16">
        <SoundwaveMesh className="-z-10 text-white opacity-[0.04]" />
        <div className="absolute -top-24 -right-24 -z-10 h-72 w-72 rounded-full bg-white/10 blur-2xl blob" />
        <div>
          <span className="eyebrow text-indigo-200 normal-case tracking-[0.12em]">iOS & Android</span>
          <h2 id="app-title" className="section-title">
            Snoresis AI Mobil Uygulamasını İndirin
          </h2>
          <p className="mt-3 max-w-md text-base leading-relaxed text-slate-300 sm:mt-5 sm:text-lg">
            Sağlığınızı her an cebinizden takip edin. iOS ve Android cihazlarınızla tam uyumlu.
          </p>
          <div className="mt-6 sm:mt-9">
            <StoreBadges />
          </div>
        </div>
        <IPhoneMockup className="max-sm:[zoom:0.72] md:rotate-[3deg]" />
      </div>
    </div>
  </section>
);
