import { Emblem } from './Emblem';

type Variant = 'screen' | 'overlay' | 'inline';

interface Props {
  /** screen: tam ekran açılış · overlay: kartın üzerini kaplar · inline: akış içinde */
  variant?: Variant;
  label?: string;
  /** screen varyantında kapanırken yumuşak geçiş */
  leaving?: boolean;
}

const WRAP: Record<Variant, string> = {
  screen: 'fixed inset-0 z-[60] bg-paper transition-opacity duration-300',
  overlay: 'absolute inset-0 z-20 rounded-[inherit] bg-white/80 backdrop-blur-sm animate-fade-in',
  inline: 'py-10',
};

export const SnoresisLoading = ({ variant = 'inline', label = 'Snoresis Yükleniyor...', leaving = false }: Props) => {
  const size = variant === 'screen' ? 64 : 48;
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center gap-5 ${WRAP[variant]} ${leaving ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
    >
      <span className="relative grid place-items-center">
        <span
          className="absolute rounded-full bg-gradient-to-br from-violet to-brand opacity-40 blur-xl animate-breathe"
          style={{ width: size * 1.5, height: size * 1.5 }}
        />
        <span className="relative animate-glow rounded-full">
          <Emblem size={size} />
        </span>
      </span>
      <p className="font-display text-sm font-semibold tracking-wide text-slate-500">{label}</p>
    </div>
  );
};
