export function formatCurrency(priceCents) {
  let value = Math.round(priceCents) / 100;
  return value % 1 === 0 ? value.toString() : value.toFixed(2);
}
