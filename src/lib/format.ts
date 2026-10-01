const tl = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 });

export const formatPrice = (value: number) => `${tl.format(value)} TL`;

export const scrollToSection = (id: string) => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
};
