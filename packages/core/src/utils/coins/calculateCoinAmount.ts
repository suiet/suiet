export default function calculateCoinAmount(
  amount: string,
  decimals: number
): string {
  if (typeof decimals !== 'number' || decimals < 0) {
    throw new Error('decimals must be a positive number');
  }
  let [integer, decimal] = amount.split('.');
  if (!decimal) {
    decimal = '';
  }
  if (decimal.length > decimals) {
    decimal = decimal.slice(0, decimals);
  }
  integer = integer.padEnd(integer.length + decimals, '0');
  decimal = decimal.padEnd(decimals, '0');
  return String(BigInt(integer) + BigInt(decimal));
}
