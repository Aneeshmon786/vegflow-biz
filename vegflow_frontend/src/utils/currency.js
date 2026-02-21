/**
 * UAE Dirham (AED) - used in UAE.
 */
export const CURRENCY_CODE = 'AED';
export const CURRENCY_SYMBOL = 'AED';

export function formatAED(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return `${CURRENCY_SYMBOL} 0.00`;
  return `${CURRENCY_SYMBOL} ${n.toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
