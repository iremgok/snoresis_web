import { Brain, Cpu, Stethoscope } from 'lucide-react';
import { SoundwaveMesh } from '../ui/SoundwaveMesh';

const PILLARS = [
  { icon: Stethoscope, title: 'Uyku uzmanları', text: 'Klinik bilgi ve saha deneyimi' },
  { icon: Cpu, title: 'Mühendislik', text: 'Bilgisayar ve yazılım ekipleri' },
  { icon: Brain, title: 'Yapay zeka', text: 'Apne ve horlama örüntü analizi' },
];

const AboutVisual = () => (
  <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#eaf1ff] to-[#f6f2ff] shadow-soft">
    <SoundwaveMesh className="text-brand opacity-[0.07]" />
    <svg viewBox="0 0 320 400" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="about-shield" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8f5cff" />
          <stop offset="1" stopColor="#0066ff" />
        </linearGradient>
        <linearGradient id="about-ring" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#c6d0e3" />
        </linearGradient>
      </defs>
      {/* yörüngeler */}
      <ellipse cx="160" cy="200" rx="128" ry="128" fill="none" stroke="#0066ff" strokeOpacity="0.12" strokeDasharray="3 7" />
      <ellipse cx="160" cy="200" rx="92" ry="92" fill="none" stroke="#7b3ff2" strokeOpacity="0.14" />
      {/* tıbbi kalkan */}
      <g transform="translate(160 196)">
        <path d="M0 -70 L56 -48 V4 C56 40 30 62 0 74 C-30 62 -56 40 -56 4 V-48 Z" fill="#0b1526" opacity="0.08" transform="translate(6 10)" />
        <path d="M0 -70 L56 -48 V4 C56 40 30 62 0 74 C-30 62 -56 40 -56 4 V-48 Z" fill="url(#about-shield)" />
        <path d="M0 -70 L56 -48 V4 C56 40 30 62 0 74 Z" fill="#fff" opacity="0.08" />
        <path
          d="M-34 6 H-16 L-8 -14 L4 24 L14 -4 L20 6 H34"
          fill="none"
          stroke="#fff"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      {/* küçük yüzük */}
      <g transform="translate(250 92)">
        <ellipse cx="0" cy="4" rx="26" ry="27" fill="none" stroke="#9aa6bd" strokeWidth="9" />
        <ellipse cx="0" cy="0" rx="26" ry="27" fill="none" stroke="url(#about-ring)" strokeWidth="8" />
      </g>
      {/* uyku evresi çubukları */}
      <g transform="translate(36 312)">
        {[
          [0, 14, 0.35],
          [12, 28, 0.55],
          [24, 40, 1],
          [36, 22, 0.7],
          [48, 32, 0.85],
          [60, 12, 0.4],
        ].map(([x, h, o]) => (
          <rect key={x} x={x} y={44 - h} width="8" height={h} rx="4" fill="url(#about-shield)" opacity={o} />
        ))}
      </g>
      <circle cx="60" cy="96" r="5" fill="#0066ff" opacity="0.25" />
      <circle cx="268" cy="300" r="7" fill="#7b3ff2" opacity="0.2" />
    </svg>
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
        <h2 className="section-title text-ink">
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
