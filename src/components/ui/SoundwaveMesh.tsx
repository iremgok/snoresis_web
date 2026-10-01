// Arka plan filigranı: üst üste binen ses dalgaları. Opaklığı çağıran taraf belirler (~%4).
const buildWave = (amp: number, freq: number, phase: number, y: number) => {
  const pts: string[] = [];
  for (let x = 0; x <= 1200; x += 12) {
    const envelope = Math.sin((x / 1200) * Math.PI);
    const v = y + Math.sin(x * freq + phase) * amp * envelope * (0.6 + 0.4 * Math.sin(x * 0.004 + phase));
    pts.push(`${x},${v.toFixed(1)}`);
  }
  return `M${pts.join(' L')}`;
};

const WAVES = Array.from({ length: 9 }, (_, i) => buildWave(40 + i * 9, 0.012 + i * 0.0015, i * 0.7, 200));

export const SoundwaveMesh = ({ className = '' }: { className?: string }) => (
  <svg
    className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    viewBox="0 0 1200 400"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    {WAVES.map((d, i) => (
      <path key={i} d={d} fill="none" stroke="currentColor" strokeWidth={1.2} vectorEffect="non-scaling-stroke" />
    ))}
  </svg>
);
