const tl = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 });

export const formatPrice = (value: number) => `${tl.format(value)} TL`;

const oneDecimal = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/** 4.75 → "4,8" */
export const formatRating = (value: number) => oneDecimal.format(value);

export const scrollToSection = (id: string) => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
};
