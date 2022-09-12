export function addressEllipsis(address: string) {
  // 0x0000000000000000000000000000000000000000 40bits / 42 length
  if (!address || !address.startsWith('0x') || address.length !== 42)
    return address;

  return address.slice(0, 7) + '....' + address.slice(-4, address.length);
}

// format currency
// less than 1M -> show original
// [1M, 1B)  -> x.xxxM
// [1B, Infinity)  -> x.xxxB
export function formatCurrency(amount: number | string) {
  const MILLION = 1000000;
  const BILLION = 1000000000;
  const TRILLION = 1000000000000;
  const _amount = Number(amount);
  if (_amount >= MILLION && _amount < BILLION)
    return format(_amount, MILLION, 'M');
  if (_amount >= BILLION && _amount < TRILLION)
    return format(_amount, BILLION, 'B');
  if (_amount >= TRILLION) return format(_amount, TRILLION, 'T');

  function format(_amount: number, measureUnit: number, unitSymbol: string) {
    const showAmount = String(
      Math.floor(_amount / (measureUnit / 1000))
    ).padEnd(4, '0');
    const result = Intl.NumberFormat('en-US').format(Number(showAmount));
    return result.replace(',', '.') + unitSymbol;
  }

  return Intl.NumberFormat('en-US').format(_amount);
}
