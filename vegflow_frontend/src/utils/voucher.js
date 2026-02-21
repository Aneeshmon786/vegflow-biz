/**
 * Voucher-style display (Tally-like accounting).
 * SL = Sales, PR = Purchase, RC = Receipt (Collection), PY = Payment (to supplier), EX = Expense.
 */
export function saleVoucher(id, paymentType) {
  return paymentType === 'credit' ? `SL-${id}` : `RC-${id}`;
}
export function purchaseVoucher(id) {
  return `PR-${id}`;
}
export function collectionVoucher(id) {
  return `RC-${id}`;
}
export function paymentVoucher(id) {
  return `PY-${id}`;
}
export function expenseVoucher(id) {
  return `EX-${id}`;
}
