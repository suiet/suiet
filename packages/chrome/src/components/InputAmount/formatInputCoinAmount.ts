export default function formatInputCoinAmount(
  numStr: unknown,
  decimals: number = 3
) {
  if (typeof numStr !== 'string') return '0';

  let res = numStr.trim() ?? '';

  // disallow negative number
  if (!Number.isNaN(+res) && Number(res) < 0) return '0';

  // allow pending decimal inputs
  if (res === '0.') return res;

  // remove all non-digit and non-dot
  res = res.replace(/[^\d.]/g, '');

  // remove redundant leading zeros
  if (/^[0]+\d+/.test(res)) {
    res = res.replace(/^0+/, '');
  }

  // process input with dots
  if (res.includes('.')) {
    // ped a leading '0' if the input is like '.1'
    if (res.startsWith('.')) res = '0' + res;
    // if more than one dot, only preserve the first dot
    if (res.split('.').length > 2) {
      const [first, ...rest] = res.split('.');
      res = first + '.' + rest.join('');
    }

    // limit the decimal places
    const [int, dec] = res.split('.');
    if (dec && dec.length > decimals) {
      const newDec = dec.slice(0, decimals);
      if (newDec === '') {
        res = int;
      } else {
        res = int + '.' + newDec;
      }
    }
  }

  if (Number(res) === 0) return '0';
  return res;
}
