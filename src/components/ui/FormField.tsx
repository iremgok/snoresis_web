import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';

type Common = { label: string; error?: string; className?: string };

const fieldClass = (error?: string) =>
  `field tabular-nums ${error ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-100' : ''}`;

const Wrapper = ({ label, error, className = '', children }: Common & { children: ReactNode }) => (
  <label className={`block ${className}`}>
    <span className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</span>
    {children}
    {error && <span className="mt-1 block text-xs text-rose-500">{error}</span>}
  </label>
);

export const Field = ({ label, error, className, ...input }: Common & InputHTMLAttributes<HTMLInputElement>) => (
  <Wrapper label={label} error={error} className={className}>
    <input {...input} aria-invalid={!!error} className={fieldClass(error)} />
  </Wrapper>
);

export const TextAreaField = ({
  label,
  error,
  className,
  ...textarea
}: Common & TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <Wrapper label={label} error={error} className={className}>
    <textarea {...textarea} aria-invalid={!!error} className={`${fieldClass(error)} resize-y`} />
  </Wrapper>
);
