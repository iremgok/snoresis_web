// Uyku evreleri (hipnogram): Uyanık → REM → Hafif → Derin. Örnek bir gecenin temsili verisi.
const STAGES = [
  { label: 'Uyanık', color: '#f5a3b5' },
  { label: 'REM', color: '#b69bff' },
  { label: 'Hafif', color: '#6fa8ff' },
  { label: 'Derin', color: '#2f6bff' },
];

// [süre (dk), evre indeksi]
const NIGHT: [number, number][] = [
  [10, 0], [20, 2], [45, 3], [25, 2], [15, 1], [30, 2], [40, 3], [20, 2], [25, 1],
  [5, 0], [35, 2], [25, 3], [30, 2], [30, 1], [20, 2], [25, 1], [12, 0],
];

const W = 300;
const ROW_H = 14;
const TOTAL = NIGHT.reduce((n, [d]) => n + d, 0);

const BARS = NIGHT.reduce<{ x: number; w: number; stage: number }[]>((acc, [d, stage]) => {
  const prev = acc.at(-1);
  acc.push({ x: prev ? prev.x + prev.w : 0, w: (d / TOTAL) * W, stage });
  return acc;
}, []);

// Evreler arası geçişleri gösteren basamaklı çizgi.
const STEP_PATH = BARS.map((b, i) => {
  const y = b.stage * ROW_H + ROW_H / 2;
  return `${i === 0 ? 'M' : 'V'}${i === 0 ? `${b.x} ${y}` : y} H${b.x + b.w}`;
}).join(' ');

export const Hypnogram = ({ className = '', showLegend = false }: { className?: string; showLegend?: boolean }) => {
  const rowH = ROW_H;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${rowH * 4}`} preserveAspectRatio="none" className={className} aria-hidden="true">
        {STAGES.map((_, i) => (
          <line
            key={i}
            x1="0"
            x2={W}
            y1={i * rowH + rowH / 2}
            y2={i * rowH + rowH / 2}
            stroke="#ffffff"
            strokeOpacity="0.07"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <path d={STEP_PATH} fill="none" stroke="#ffffff" strokeOpacity="0.28" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        {BARS.map((b, i) => (
          <line
            key={i}
            x1={b.x}
            x2={b.x + b.w}
            y1={b.stage * rowH + rowH / 2}
            y2={b.stage * rowH + rowH / 2}
            stroke={STAGES[b.stage].color}
            strokeWidth="4"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      {showLegend && (
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[0.65rem] text-white/60">
          {STAGES.map((s) => (
            <span key={s.label} className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: s.color }} />
              {s.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
