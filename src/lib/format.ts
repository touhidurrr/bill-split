/** Two-decimal money string. */
export const money = (n: number): string =>
  Number.isFinite(n) ? n.toFixed(2) : "0.00";

/** Up to four decimals, trailing zeros trimmed. */
export const compact = (n: number): string =>
  Number.isFinite(n) ? n.toFixed(4).replace(/\.?0+$/, "") : "0";

/** Maximum float precision — poi poi hisab. */
export const exact = (n: number): string =>
  Number.isFinite(n) ? String(n) : "0";

export const parseAmount = (raw: string): number => {
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) ? n : 0;
};
