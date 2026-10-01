import { Bell, ChartLine, House, ShoppingBag, User, type LucideIcon } from 'lucide-react';
import { Emblem } from './Emblem';

const SCORE = 0.88;
const GAUGE_C = 2 * Math.PI * 52;

// Gece boyu SpO₂ ve nabız eğrileri (0–1 aralığına normalize)
const vitalsPath = (seed: number, dipAt: number) => {
  const pts: string[] = [];
  for (let x = 0; x <= 200; x += 5) {
    const dip = Math.exp(-((x - dipAt) ** 2) / 120) * 0.45;
    const y = 0.5 + Math.sin(x * 0.09 + seed) * 0.12 + Math.sin(x * 0.23 + seed * 2) * 0.05 + dip * (seed > 1 ? -1 : 1);
    pts.push(`${x},${(36 - y * 32).toFixed(1)}`);
  }
  return `M${pts.join(' L')}`;
};
const SPO2 = vitalsPath(0.4, 120);
const HR = vitalsPath(2.1, 122);

const TABS: { icon: LucideIcon; label: string }[] = [
  { icon: House, label: 'Home' },
  { icon: Bell, label: 'Alerts' },
  { icon: ChartLine, label: 'Insights' },
  { icon: ShoppingBag, label: 'Shop' },
  { icon: User, label: 'Account' },
];

const StatusBar = () => (
  <div className="flex items-center justify-between px-6 pt-3.5 text-[0.68rem] font-semibold">
    <span className="tabular-nums">9:41</span>
    <span className="flex items-center gap-1" aria-hidden="true">
      <svg width="16" height="10" viewBox="0 0 16 10" fill="currentColor">
        <rect x="0" y="7" width="3" height="3" rx="0.8" />
        <rect x="4.3" y="5" width="3" height="5" rx="0.8" />
        <rect x="8.6" y="2.5" width="3" height="7.5" rx="0.8" />
        <rect x="12.9" y="0" width="3" height="10" rx="0.8" />
      </svg>
      <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor">
        <path d="M7 2.2c1.9 0 3.6.7 4.9 1.9l1.1-1.1A8.6 8.6 0 0 0 7 .6 8.6 8.6 0 0 0 1 3l1.1 1.1A7 7 0 0 1 7 2.2Zm0 3.1c1 0 2 .4 2.7 1.1l1.1-1.1A5.4 5.4 0 0 0 7 3.8c-1.5 0-2.8.6-3.8 1.5l1.1 1.1c.7-.7 1.7-1.1 2.7-1.1ZM7 7.1c-.5 0-.9.2-1.2.5L7 8.9l1.2-1.3c-.3-.3-.7-.5-1.2-.5Z" />
      </svg>
      <span className="relative ml-0.5 h-[11px] w-[22px] rounded-[3.5px] border border-white/45 p-[1.5px]">
        <span className="block h-full w-[78%] rounded-[1.5px] bg-white" />
        <span className="absolute top-1/2 -right-[3px] h-1 w-[1.5px] -translate-y-1/2 rounded-r bg-white/45" />
      </span>
    </span>
  </div>
);

const ApneaGauge = () => (
  <div className="relative mx-auto mt-3 grid h-[9.5rem] w-[9.5rem] place-items-center">
    <div className="absolute inset-4 rounded-full bg-gradient-to-br from-brand/25 to-violet/25 blur-xl" />
    <svg viewBox="0 0 120 120" className="absolute inset-0 -rotate-90" aria-hidden="true">
      <defs>
        <linearGradient id="iphone-gauge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3d8bff" />
          <stop offset="1" stopColor="#8f5cff" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="52" fill="none" stroke="#ffffff" strokeOpacity="0.07" strokeWidth="9" />
      <circle
        cx="60"
        cy="60"
        r="52"
        fill="none"
        stroke="url(#iphone-gauge)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray={`${SCORE * GAUGE_C} ${GAUGE_C}`}
      />
    </svg>
    <div className="relative text-center">
      <p className="font-display text-[2rem] leading-none font-bold tabular-nums">%88</p>
      <p className="mt-1 text-[0.6rem] font-medium tracking-wide text-white/55 uppercase">Score</p>
    </div>
  </div>
);

export const IPhoneMockup = ({ className = '' }: { className?: string }) => (
  <div className={`relative mx-auto w-[272px] ${className}`} role="img" aria-label="Snoresis AI uygulaması: apne skoru %88, orta risk">
    {/* yan tuşlar */}
    <span className="absolute top-[92px] -left-[3px] h-6 w-[3px] rounded-l bg-[#2a3142]" />
    <span className="absolute top-[132px] -left-[3px] h-11 w-[3px] rounded-l bg-[#2a3142]" />
    <span className="absolute top-[184px] -left-[3px] h-11 w-[3px] rounded-l bg-[#2a3142]" />
    <span className="absolute top-[148px] -right-[3px] h-16 w-[3px] rounded-r bg-[#2a3142]" />

    {/* titanyum çerçeve + ince bezel */}
    <div className="rounded-[3rem] bg-gradient-to-b from-[#4a5263] via-[#262c39] to-[#3c4352] p-[3px] shadow-[0_50px_90px_-30px_rgb(0_0_0/0.65),0_0_0_1px_rgb(255_255_255/0.08)_inset]">
      <div className="rounded-[2.85rem] bg-black p-[7px]">
        <div className="relative flex h-[548px] flex-col overflow-hidden rounded-[2.4rem] bg-[radial-gradient(120%_60%_at_50%_0%,#13284d_0%,#0a1428_55%,#070e1d_100%)] text-white">
          {/* Dynamic Island */}
          <div className="absolute top-2.5 left-1/2 z-10 flex h-[26px] w-[86px] -translate-x-1/2 items-center justify-end rounded-full bg-black pr-2.5">
            <span className="h-2 w-2 rounded-full bg-[#141a2a] ring-1 ring-[#1e2740]" />
          </div>
          <StatusBar />

          <div className="flex min-h-0 flex-1 flex-col px-4 pt-4">
            {/* üst başlık */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Emblem size={24} />
                <span className="font-display text-[0.85rem] font-bold tracking-tight">
                  Snoresis <span className="text-sky-300">AI</span>
                </span>
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2 py-1 text-[0.58rem] font-semibold text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                Connected
              </span>
            </div>

            {/* apne göstergesi */}
            <ApneaGauge />
            <div className="mt-1 text-center">
              <p className="font-display text-[0.8rem] font-semibold">Apnea Score</p>
              <span className="mt-1 inline-block rounded-full bg-amber-400/15 px-2 py-0.5 text-[0.56rem] font-semibold text-amber-300">
                Moderate Risk
              </span>
            </div>

            {/* metrik kartları */}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.05] p-2.5">
                <p className="text-[0.55rem] leading-tight text-white/55">
                  Apnea Events
                  <br />
                  Last Night
                </p>
                <p className="mt-1.5 font-display text-xl leading-none font-bold tabular-nums">12</p>
                <div className="mt-2 flex h-3 items-end gap-[3px]" aria-hidden="true">
                  {[3, 5, 2, 7, 4, 9, 5, 3, 6, 2].map((h, i) => (
                    <span key={i} className="flex-1 rounded-sm bg-violet/70" style={{ height: `${h * 10}%` }} />
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.05] p-2.5">
                <p className="text-[0.55rem] leading-tight text-white/55">
                  Sleep Duration
                  <br />& Quality
                </p>
                <p className="mt-1.5 font-display text-[1.05rem] leading-[1.25rem] font-bold whitespace-nowrap tabular-nums">
                  7h 20m <span className="text-[0.56rem] font-semibold text-sky-300">(82%)</span>
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-brand to-violet" />
                </div>
              </div>
            </div>

            {/* gece boyu yaşamsal veriler */}
            <div className="mt-2 rounded-2xl border border-white/[0.07] bg-white/[0.05] p-2.5">
              <div className="flex items-center justify-between">
                <p className="text-[0.62rem] font-semibold">Overnight Vitals</p>
                <span className="flex gap-2 text-[0.5rem] text-white/55">
                  <span className="flex items-center gap-1">
                    <span className="h-1 w-2.5 rounded-full bg-sky-400" /> SpO₂
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-1 w-2.5 rounded-full bg-rose-400" /> HR
                  </span>
                </span>
              </div>
              <svg viewBox="0 0 200 40" className="mt-1 h-9 w-full" preserveAspectRatio="none" aria-hidden="true">
                <path d={SPO2} fill="none" stroke="#38bdf8" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
                <path d={HR} fill="none" stroke="#fb7185" strokeWidth="1.6" strokeOpacity="0.85" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>
          </div>

          {/* alt gezinme çubuğu */}
          <nav className="mt-2 border-t border-white/[0.06] bg-[#070e1d]/80 px-2 pt-2 pb-5" aria-hidden="true">
            <ul className="flex justify-between">
              {TABS.map(({ icon: Icon, label }, i) => (
                <li
                  key={label}
                  className={`flex flex-1 flex-col items-center gap-0.5 text-[0.5rem] font-medium ${
                    i === 0 ? 'text-sky-300' : 'text-white/45'
                  }`}
                >
                  <Icon size={15} strokeWidth={i === 0 ? 2.4 : 2} />
                  {label}
                </li>
              ))}
            </ul>
            <span className="mx-auto mt-2.5 block h-1 w-24 rounded-full bg-white/80" />
          </nav>
        </div>
      </div>
    </div>
  </div>
);
