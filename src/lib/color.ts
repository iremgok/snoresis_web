const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));

const channels = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255] as const;
};

/** Rengi açar (amount > 0) veya koyulaştırır (amount < 0). amount: -1..1 */
export const shade = (hex: string, amount: number) => {
  const target = amount < 0 ? 0 : 255;
  const p = Math.abs(amount);
  const [r, g, b] = channels(hex).map((c) => clamp(c + (target - c) * p));
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
};

export const isLight = (hex: string) => {
  const [r, g, b] = channels(hex);
  return 0.299 * r + 0.587 * g + 0.114 * b > 190;
};
