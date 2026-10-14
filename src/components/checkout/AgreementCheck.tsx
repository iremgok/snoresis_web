import { Check } from 'lucide-react';
import { useLegal } from '../../context/legal';

interface Props {
  checked: boolean;
  error?: string;
  onChange: (checked: boolean) => void;
}

const linkClass =
  'cursor-pointer font-semibold text-ink underline decoration-slate-300 underline-offset-2 hover:decoration-brand';

/** Mesafeli Satış Sözleşmesi + Ön Bilgilendirme Formu onayı (önceden işaretli gelmez). */
export const AgreementCheck = ({ checked, error, onChange }: Props) => {
  const { openPolicy } = useLegal();
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3 text-[0.82rem] leading-relaxed text-slate-600">
        <span className="relative mt-0.5 grid shrink-0 place-items-center">
          <input
            type="checkbox"
            name="agreement"
            required
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            aria-invalid={!!error}
            aria-describedby={error ? 'agreement-error' : undefined}
            className={`peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 bg-white transition checked:border-brand checked:bg-brand focus-visible:ring-4 focus-visible:ring-brand/15 ${
              error ? 'border-rose-400' : 'border-slate-300'
            }`}
          />
          <Check
            size={13}
            strokeWidth={3.5}
            className="pointer-events-none absolute text-white opacity-0 peer-checked:opacity-100"
          />
        </span>
        <span>
          <button type="button" onClick={() => openPolicy('distance-sales')} className={linkClass}>
            Mesafeli Satış Sözleşmesi
          </button>{' '}
          ve{' '}
          <button type="button" onClick={() => openPolicy('pre-info')} className={linkClass}>
            Ön Bilgilendirme Formu
          </button>
          'nu okudum, kabul ediyorum.
        </span>
      </label>
      {error && (
        <p id="agreement-error" className="mt-1.5 pl-8 text-xs text-rose-500">
          {error}
        </p>
      )}
    </div>
  );
};
