import { useId } from 'react';
import { isLight, shade } from '../../lib/color';
import type { ProductArt as Art } from '../../types';

interface Props {
  art: Art;
  color: string;
  className?: string;
}

// Seçilen renge göre yeniden boyanan vektör ürün çizimleri.
export const ProductArt = ({ art, color, className = '' }: Props) => {
  const uid = useId().replace(/:/g, '');
  const light = shade(color, 0.45);
  const dark = shade(color, -0.45);
  const edge = isLight(color) ? 'rgba(11,21,38,0.16)' : 'rgba(255,255,255,0.08)';

  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`b${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={light} />
          <stop offset="0.45" stopColor={color} />
          <stop offset="1" stopColor={dark} />
        </linearGradient>
        <radialGradient id={`s${uid}`}>
          <stop offset="0" stopColor="#0b1526" stopOpacity="0.28" />
          <stop offset="1" stopColor="#0b1526" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="180" rx="64" ry="8" fill={`url(#s${uid})`} />

      {art === 'ring' && (
        <g>
          {/* gövde kalınlığı */}
          <ellipse cx="100" cy="102" rx="62" ry="64" fill="none" stroke={dark} strokeWidth="22" />
          {/* ön yüz */}
          <ellipse cx="100" cy="96" rx="62" ry="64" fill="none" stroke={`url(#b${uid})`} strokeWidth="20" />
          <ellipse cx="100" cy="96" rx="72" ry="74" fill="none" stroke={edge} strokeWidth="1" />
          <ellipse cx="100" cy="96" rx="52" ry="54" fill="none" stroke={edge} strokeWidth="1" />
          {/* parlama */}
          <path
            d="M52 62 A62 64 0 0 1 112 32.6"
            fill="none"
            stroke="#fff"
            strokeOpacity="0.55"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* sensörler */}
          <rect x="86" y="146" width="28" height="9" rx="4.5" fill={shade(color, -0.65)} />
          <circle cx="94" cy="150.5" r="2" fill="#ff4d6d" />
          <circle cx="106" cy="150.5" r="2" fill="#4dd6ff" />
        </g>
      )}

      {art === 'dock' && (
        <g>
          <rect x="34" y="112" width="132" height="58" rx="26" fill={dark} />
          <rect x="34" y="104" width="132" height="58" rx="26" fill={`url(#b${uid})`} stroke={edge} />
          <ellipse cx="100" cy="120" rx="40" ry="12" fill={shade(color, -0.3)} />
          <ellipse cx="100" cy="117" rx="34" ry="9" fill={shade(color, -0.55)} />
          <ellipse cx="100" cy="116" rx="18" ry="4" fill="none" stroke="#fff" strokeOpacity="0.35" />
          <circle cx="146" cy="142" r="3" fill="#2ee6a6" />
          <circle cx="146" cy="142" r="7" fill="#2ee6a6" opacity="0.18" />
          <path d="M54 108 Q100 98 146 108" fill="none" stroke="#fff" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" />
          <rect x="18" y="130" width="18" height="6" rx="3" fill="#2a2f3a" />
          <path d="M18 133 H4" stroke="#2a2f3a" strokeWidth="3" strokeLinecap="round" />
          {/* yuvaya oturan yüzük silüeti */}
          <ellipse cx="100" cy="86" rx="26" ry="27" fill="none" stroke="#c9ced8" strokeOpacity="0.9" strokeWidth="8" />
          <path d="M80 72 A26 27 0 0 1 104 59" fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}

      {art === 'case' && (
        <g>
          <rect x="30" y="74" width="140" height="98" rx="44" fill={dark} />
          <rect x="30" y="66" width="140" height="98" rx="44" fill={`url(#b${uid})`} stroke={edge} />
          <path d="M30 116 H170" stroke={shade(color, -0.5)} strokeWidth="2" />
          <path d="M30 118 H170" stroke="#fff" strokeOpacity="0.25" strokeWidth="1" />
          <rect x="88" y="112" width="24" height="10" rx="5" fill={shade(color, -0.35)} />
          <path d="M58 82 Q100 70 142 82" fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="3" strokeLinecap="round" />
          <circle cx="100" cy="144" r="7" fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="1.5" />
        </g>
      )}
    </svg>
  );
};
