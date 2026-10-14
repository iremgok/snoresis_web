import { useId } from 'react';

export const Emblem = ({ size = 36, className = '' }: { size?: number; className?: string }) => {
  const id = useId();
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7B3FF2" />
          <stop offset="1" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="24" fill={`url(#${id})`} />
      <circle cx="24" cy="24" r="23" fill="none" stroke="#fff" strokeOpacity="0.18" />
      <path
        d="M31 16.5c-1.8-2.6-4.6-3.9-7.6-3.7-3.7.3-6 2.8-5.6 5.6.5 3.1 3.8 4.1 6.7 4.9 3.4.9 7 2 7.3 5.6.3 3.3-2.5 5.9-6.5 6.2-3.4.2-6.4-1.2-8.1-3.8"
        fill="none"
        stroke="#fff"
        strokeWidth="3.6"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const Logo = ({ light = false }: { light?: boolean }) => (
  <span className="flex items-center gap-2 sm:gap-2.5">
    <Emblem className="h-8 w-8 sm:h-9 sm:w-9" />
    <span className={`font-display text-lg font-bold sm:text-xl tracking-tight ${light ? 'text-white' : 'text-ink'}`}>
      Snoresis
      <span className="ml-1 align-super text-[0.6rem] font-semibold tracking-widest text-brand">AI</span>
    </span>
  </span>
);
