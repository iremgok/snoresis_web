import { Activity, Bluetooth, FileText, HeartPulse, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { SoundwaveMesh } from '../ui/SoundwaveMesh';

const ApneaGlyph = () => (
  <svg viewBox="0 0 160 40" className="h-10 w-full" aria-hidden="true">
    <rect x="70" y="3" width="30" height="34" rx="4" fill="#fbbf24" fillOpacity="0.08" stroke="#fbbf24" strokeOpacity="0.6" strokeDasharray="3 3" />
    <path
      d="M0 20 Q8 4 16 20 T32 20 T48 20 T64 20 L70 20 L100 20 Q108 0 116 20 T132 20 T148 20 T164 20"
      fill="none"
      stroke="#7fb2ff"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const VitalsGlyph = () => (
  <div className="flex items-end gap-6">
    <div>
      <p className="text-[0.65rem] tracking-wider text-white/50 uppercase">SpO₂</p>
      <p className="font-display text-2xl font-semibold tabular-nums">%96</p>
    </div>
    <div>
      <p className="text-[0.65rem] tracking-wider text-white/50 uppercase">Nabız</p>
      <p className="font-display text-2xl font-semibold tabular-nums">
        61<span className="ml-1 text-xs text-white/50">bpm</span>
      </p>
    </div>
  </div>
);

const ReportGlyph = () => (
  <div className="flex items-center gap-3">
    <div className="relative h-12 w-10 rounded-md bg-white/90 p-1.5">
      <div className="h-1 w-5 rounded bg-rose-400" />
      <div className="mt-1.5 h-0.5 w-6 rounded bg-slate-300" />
      <div className="mt-1 h-0.5 w-5 rounded bg-slate-300" />
      <div className="mt-1 h-0.5 w-6 rounded bg-slate-300" />
      <span className="absolute right-0 bottom-0 rounded-tl bg-rose-500 px-1 text-[0.5rem] font-bold text-white">PDF</span>
    </div>
    <p className="text-xs leading-snug text-white/60">
      Uyku_Raporu.pdf
      <br />
      <span className="text-white/40">Doktorunuzla paylaşın</span>
    </p>
  </div>
);

const BleGlyph = () => (
  <div className="flex items-center gap-2">
    {[0, 1, 2, 3, 4].map((i) => (
      <span
        key={i}
        className="w-1.5 rounded-full bg-sky-300"
        style={{ height: 8 + i * 6, opacity: 0.35 + i * 0.15 }}
      />
    ))}
    <span className="ml-2 text-xs text-white/60">Bağlı · düşük güç</span>
  </div>
);

const FEATURES: { icon: LucideIcon; title: string; text: string; glyph: ReactNode; tint: string }[] = [
  {
    icon: Activity,
    title: 'Gerçek Zamanlı Apne Tespiti',
    text: 'Uyku boyunca nefes duraksamalarını milisaniyelik hassasiyetle kaydeder.',
    glyph: <ApneaGlyph />,
    tint: 'from-sky-400/25',
  },
  {
    icon: HeartPulse,
    title: 'Biyometrik Veri Analizi',
    text: 'SpO2 (Kandaki Oksijen) ve Nabız değerlerini anlık izler.',
    glyph: <VitalsGlyph />,
    tint: 'from-rose-400/25',
  },
  {
    icon: FileText,
    title: 'Doktor Raporu Oluşturma',
    text: 'PDF formatında detaylı klinik uyku analiz raporu üretir.',
    glyph: <ReportGlyph />,
    tint: 'from-violet-400/25',
  },
  {
    icon: Bluetooth,
    title: 'Bluetooth BLE Entegrasyonu',
    text: 'Düşük güç tüketimi ile kesintisiz veri aktarımı.',
    glyph: <BleGlyph />,
    tint: 'from-emerald-400/25',
  },
];

export const FeaturesSection = () => (
  <section id="ozellikler" className="relative isolate overflow-hidden bg-night py-24 text-white md:py-32">
    <div className="absolute top-1/3 -left-40 -z-10 h-[30rem] w-[30rem] rounded-full bg-brand/25 blur-3xl" />
    <div className="absolute -right-32 -bottom-40 -z-10 h-[26rem] w-[26rem] rounded-full bg-violet/20 blur-3xl" />
    <SoundwaveMesh className="-z-10 text-white opacity-[0.04]" />

    <div className="container-x">
      <div className="mx-auto mb-16 max-w-2xl text-center">
        <span className="eyebrow text-sky-300">Özellikler</span>
        <h2 className="section-title">
          Gece boyunca sessizce çalışır,
          <br className="hidden sm:block" /> sabah size anlatır.
        </h2>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {FEATURES.map(({ icon: Icon, title, text, glyph, tint }, i) => (
          <article
            key={title}
            className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl transition duration-300 hover:border-white/25 hover:bg-white/[0.07] md:p-8 ${
              i % 2 === 1 ? 'sm:translate-y-8' : ''
            }`}
          >
            <div
              className={`pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br ${tint} to-transparent blur-2xl transition group-hover:scale-125`}
            />
            <div className="flex items-start justify-between">
              <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/15 bg-white/10">
                <Icon size={22} />
              </span>
              <span className="font-display text-sm font-semibold text-white/30 tabular-nums">0{i + 1}</span>
            </div>
            <h3 className="mt-6 text-2xl font-semibold">{title}</h3>
            <p className="mt-2 max-w-sm leading-relaxed text-white/65">{text}</p>
            <div className="mt-7 border-t border-white/10 pt-5">{glyph}</div>
          </article>
        ))}
      </div>
    </div>
  </section>
);
