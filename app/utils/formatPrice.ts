export default function formatPrice(priceInCents: number): string {
  return `$${Number(priceInCents / 100)
    .toFixed(2)
    .toString()
    .replace('.00', '')}`;
}
