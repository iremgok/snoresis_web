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

      {art === 'wristband' && (
        <g>
          {/* kayış: arka yarısı gölgede, ön yarısı renkli */}
          <ellipse cx="100" cy="104" rx="70" ry="44" fill="none" stroke={dark} strokeWidth="20" />
          <ellipse cx="100" cy="98" rx="70" ry="44" fill="none" stroke={`url(#b${uid})`} strokeWidth="18" />
          <ellipse cx="100" cy="98" rx="79" ry="53" fill="none" stroke={edge} strokeWidth="1" />
          <path
            d="M44 74 A70 44 0 0 1 112 54.4"
            fill="none"
            stroke="#fff"
            strokeOpacity="0.5"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* sensör modülü */}
          <rect x="66" y="118" width="68" height="40" rx="15" fill={shade(color, -0.6)} />
          <rect x="66" y="114" width="68" height="40" rx="15" fill="#1b2232" stroke={edge} />
          <rect x="74" y="121" width="52" height="26" rx="9" fill="#0d1320" />
          <path
            d="M80 134 h8 l4 -7 l5 13 l4 -6 h19"
            fill="none"
            stroke="#4dd6ff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )}

      {art === 'clip' && (
        <g>
          {/* gövde ve menteşe */}
          <rect x="36" y="76" width="128" height="80" rx="34" fill={dark} />
          <rect x="36" y="68" width="128" height="80" rx="34" fill={`url(#b${uid})`} stroke={edge} />
          <path d="M40 108 H160" stroke={shade(color, -0.5)} strokeWidth="2" />
          <rect x="30" y="98" width="14" height="20" rx="6" fill={shade(color, -0.35)} />
          {/* parmak yuvası */}
          <ellipse cx="160" cy="108" rx="10" ry="16" fill="#0d1320" />
          <path
            d="M60 80 Q100 70 140 80"
            fill="none"
            stroke="#fff"
            strokeOpacity="0.45"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* ekran */}
          <rect x="70" y="84" width="54" height="18" rx="6" fill="#0d1320" />
          <text x="80" y="97.5" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="700" fill="#4dd6ff">
            97
          </text>
          <circle cx="112" cy="93" r="3" fill="#ff4d6d" />
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
          <path
            d="M54 108 Q100 98 146 108"
            fill="none"
            stroke="#fff"
            strokeOpacity="0.4"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <rect x="18" y="130" width="18" height="6" rx="3" fill="#2a2f3a" />
          <path d="M18 133 H4" stroke="#2a2f3a" strokeWidth="3" strokeLinecap="round" />
          {/* yuvaya oturan bileklik sensör modülü */}
          <rect x="76" y="80" width="48" height="30" rx="11" fill="#1b2232" stroke="#c9ced8" strokeOpacity="0.6" />
          <rect x="83" y="86" width="34" height="17" rx="6" fill="#0d1320" />
          <path
            d="M80 82 Q100 76 120 82"
            fill="none"
            stroke="#fff"
            strokeOpacity="0.5"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      )}

      {art === 'case' && (
        <g>
          <rect x="30" y="74" width="140" height="98" rx="44" fill={dark} />
          <rect x="30" y="66" width="140" height="98" rx="44" fill={`url(#b${uid})`} stroke={edge} />
          <path d="M30 116 H170" stroke={shade(color, -0.5)} strokeWidth="2" />
          <path d="M30 118 H170" stroke="#fff" strokeOpacity="0.25" strokeWidth="1" />
          <rect x="88" y="112" width="24" height="10" rx="5" fill={shade(color, -0.35)} />
          <path
            d="M58 82 Q100 70 142 82"
            fill="none"
            stroke="#fff"
            strokeOpacity="0.45"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="100" cy="144" r="7" fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="1.5" />
        </g>
      )}
    </svg>
  );
};
