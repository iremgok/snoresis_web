import { Brain, Cpu, Stethoscope } from 'lucide-react';
import { SoundwaveMesh } from '../ui/SoundwaveMesh';

const PILLARS = [
  { icon: Stethoscope, title: 'Uyku uzmanları', text: 'Klinik bilgi ve saha deneyimi' },
  { icon: Cpu, title: 'Mühendislik', text: 'Bilgisayar ve yazılım ekipleri' },
  { icon: Brain, title: 'Yapay zeka', text: 'Apne ve horlama örüntü analizi' },
];

// Yay yolu: merkez (cx, cy), yarıçap r, derece cinsinden başlangıç/bitiş (0 = tepe, saat yönü)
const polar = (cx: number, cy: number, r: number, deg: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [+(cx + r * Math.cos(a)).toFixed(2), +(cy + r * Math.sin(a)).toFixed(2)] as const;
};

const arc = (cx: number, cy: number, r: number, from: number, to: number) => {
  const [x1, y1] = polar(cx, cy, r, from);
  const [x2, y2] = polar(cx, cy, r, to);
  return `M${x1} ${y1} A${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${x2} ${y2}`;
};

// Gece boyunca uyku evreleri (derin / REM / hafif / uyanık), 360° = tüm gece
const STAGES: [number, number, string][] = [
  [4, 58, '#7b3ff2'],
  [62, 104, '#4f46e5'],
  [108, 150, '#7cb4ff'],
  [154, 166, '#c3cad8'],
  [170, 232, '#7b3ff2'],
  [236, 284, '#4f46e5'],
  [288, 340, '#7cb4ff'],
];

const TICKS = Array.from({ length: 60 }, (_, i) => i * 6);

// Parmak ucu PPG nabız dalgası; ortadaki düzleşme bir apne olayını işaret eder
const pulsePath = (() => {
  const pts: string[] = [];
  for (let x = 0; x <= 272; x += 2) {
    const t = (x % 34) / 34;
    const beat = Math.exp(-((t - 0.28) ** 2) / 0.006) - 0.35 * Math.exp(-((t - 0.55) ** 2) / 0.01);
    const damp = x > 120 && x < 168 ? 0.25 : 1;
    pts.push(`${x},${(-beat * 22 * damp).toFixed(1)}`);
  }
  return `M${pts.join(' L')}`;
})();

const AboutVisual = () => (
  <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[2rem] border border-white/80 bg-gradient-to-b from-[#edf3ff] via-[#f3f1ff] to-[#f8f7fc] shadow-soft">
    <SoundwaveMesh className="text-brand opacity-[0.04]" />
    <svg viewBox="0 0 320 400" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="about-brand" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7b3ff2" />
          <stop offset="1" stopColor="#4f46e5" />
        </linearGradient>
        <linearGradient id="about-metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.45" stopColor="#dfe5f0" />
          <stop offset="1" stopColor="#9aa8c2" />
        </linearGradient>
        <linearGradient id="about-metal-edge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8592ab" />
          <stop offset="1" stopColor="#5b6883" />
        </linearGradient>
        <radialGradient id="about-sensor">
          <stop offset="0" stopColor="#7cb4ff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#7cb4ff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="about-core">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* analiz kadranı: ölçek çizgileri ve uyku evresi yayları */}
      <g>
        {TICKS.map((d) => {
          const major = d % 30 === 0;
          const [x1, y1] = polar(160, 172, 122, d);
          const [x2, y2] = polar(160, 172, major ? 131 : 127, d);
          return (
            <line
              key={d}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#0b1526"
              strokeOpacity={major ? 0.28 : 0.1}
              strokeWidth={major ? 1.6 : 1}
              strokeLinecap="round"
            />
          );
        })}
        <circle cx="160" cy="172" r="110" fill="none" stroke="#0b1526" strokeOpacity="0.05" strokeWidth="8" />
        {STAGES.map(([from, to, color]) => (
          <path key={from} d={arc(160, 172, 110, from, to)} stroke={color} strokeWidth="8" strokeLinecap="round" fill="none" />
        ))}
        <circle cx="160" cy="172" r="92" fill="none" stroke="#4f46e5" strokeOpacity="0.1" strokeDasharray="2 6" />
        <circle cx="160" cy="172" r="84" fill="url(#about-core)" />
      </g>

      {/* akıllı yüzük: perspektifte metal gövde ve optik sensör ışığı */}
      <g>
        <ellipse cx="160" cy="214" rx="60" ry="9" fill="#0b1526" opacity="0.08" />
        <ellipse cx="160" cy="180" rx="56" ry="24" fill="none" stroke="url(#about-metal-edge)" strokeWidth="15" />
        <ellipse cx="160" cy="171" rx="56" ry="24" fill="none" stroke="url(#about-metal)" strokeWidth="15" />
        <ellipse cx="160" cy="171" rx="49" ry="18" fill="none" stroke="#5b6883" strokeOpacity="0.35" strokeWidth="1.5" />
        <path d="M112 162 C128 147 192 147 208 162" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
        <ellipse cx="160" cy="198" rx="30" ry="12" fill="url(#about-sensor)" />
        <rect x="153" y="190" width="14" height="6" rx="3" fill="#0b1526" opacity="0.65" />
        <circle cx="157" cy="193" r="1.6" fill="#7cb4ff" />
        <circle cx="163" cy="193" r="1.6" fill="#ff6b8a" />
      </g>

      {/* nabız dalgası */}
      <g transform="translate(24 334)">
        <line x1="0" y1="0" x2="272" y2="0" stroke="#0b1526" strokeOpacity="0.06" />
        <rect x="120" y="-30" width="48" height="44" rx="8" fill="#7b3ff2" opacity="0.07" />
        <path d={pulsePath} fill="none" stroke="url(#about-brand)" strokeWidth="2.2" strokeLinejoin="round" />
        <circle cx="272" cy="0" r="7" fill="#4f46e5" opacity="0.15" />
        <circle cx="272" cy="0" r="3.2" fill="#4f46e5" />
      </g>
    </svg>

    {/* cam veri kartları */}
    <div className="absolute top-5 left-5 rounded-2xl border border-white/80 bg-white/65 px-3.5 py-2.5 shadow-soft backdrop-blur-md">
      <p className="text-[0.62rem] font-semibold tracking-wide text-slate-500 uppercase">SpO₂ ort.</p>
      <p className="font-display text-lg leading-tight font-bold text-ink tabular-nums">%96</p>
    </div>
    <div className="absolute top-5 right-5 rounded-2xl border border-white/80 bg-white/65 px-3.5 py-2.5 text-right shadow-soft backdrop-blur-md">
      <p className="text-[0.62rem] font-semibold tracking-wide text-slate-500 uppercase">Nabız</p>
      <p className="font-display text-lg leading-tight font-bold text-ink tabular-nums">
        58 <span className="text-xs font-semibold text-slate-400">bpm</span>
      </p>
    </div>
    <div className="absolute inset-x-5 bottom-5 flex items-center justify-between text-[0.62rem] font-semibold tracking-wide text-slate-500 uppercase">
      <span className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> AI nabız analizi
      </span>
      <span className="text-violet">Apne · 02:14</span>
    </div>
  </div>
);

export const AboutSection = () => (
  <section id="hakkimizda" className="relative overflow-hidden py-24 md:py-32">
    <div className="container-x grid items-center gap-14 md:grid-cols-[0.9fr_1.1fr] lg:gap-20">
      <AboutVisual />

      <div>
        <p className="section-label">
          <span className="h-0.5 w-10 rounded-full bg-brand" />
          Hakkımızda
        </p>
        <h2 className="section-title-compact text-ink">
          Uyku Sağlığında <span className="text-brand">Yenilikçi</span> Çözümler
        </h2>
        <div className="mt-7 space-y-4 text-[1.05rem] leading-relaxed text-slate-600">
          <p>
            Snoresis, uyku sağlığı teknolojileri alanında öncü bir firmadır. Misyonumuz, herkesin kaliteli ve sağlıklı
            bir uyku deneyimi yaşamasını sağlamaktır.
          </p>
          <p>
            Türkiye'nin önde gelen uyku uzmanları ve bilgisayar/yazılım mühendisleri ile çalışarak horlama ve uyku
            apnesi gibi problemlere <strong className="font-semibold text-ink">yapay zeka destekli</strong> akıllı
            çözümler üretiyoruz.
          </p>
        </div>

        <ul className="mt-10 grid gap-3 sm:grid-cols-3">
          {PILLARS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="rounded-2xl border border-line bg-white p-4 shadow-soft">
              <Icon size={20} className="text-brand" />
              <p className="mt-3 font-display font-semibold text-ink">{title}</p>
              <p className="mt-0.5 text-sm text-slate-500">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);
