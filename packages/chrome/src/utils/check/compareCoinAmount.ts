import { isSafeConvertToNumber } from '../check';

export default function compareCoinAmount(
  a: string | bigint | number,
  b: string | bigint | number
) {
  if (isSafeConvertToNumber(a) && isSafeConvertToNumber(b)) {
    const res = Number(a) - Number(b);
    return res === 0 ? 0 : res > 0 ? 1 : -1;
  }
  const res = BigInt(a) - BigInt(b);
  return res === 0n ? 0 : res > 0n ? 1 : -1;
}
