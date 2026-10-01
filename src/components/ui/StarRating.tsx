import { Star } from 'lucide-react';
import { formatRating } from '../../lib/format';

/** Kesirli puanı da gösteren yıldız dizisi (ör. 4,7 → dördüncü yıldızdan sonra %70 dolu) */
export const Stars = ({ value, size = 15, className = '' }: { value: number; size?: number; className?: string }) => (
  <span className={`inline-flex items-center gap-0.5 ${className}`} role="img" aria-label={`5 üzerinden ${formatRating(value)} puan`}>
    {[0, 1, 2, 3, 4].map((i) => {
      const fill = Math.max(0, Math.min(1, value - i));
      return (
        <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
          <Star size={size} className="absolute inset-0 fill-slate-200 text-slate-200" strokeWidth={0} />
          <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
            <Star size={size} className="fill-amber-400 text-amber-400" strokeWidth={0} />
          </span>
        </span>
      );
    })}
  </span>
);
