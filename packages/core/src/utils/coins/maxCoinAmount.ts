import { isSuiToken } from '@suiet/chrome-ext/src/utils/check';

/**
 * Calculate max coin amount based on coin type
 * @param coinType
 * @param amount  should be the actual amount, without decimal
 * @param opts
 */
export default function maxCoinAmount(
  coinType: string,
  amount: string,
  opts?: {
    gasBudget?: string;
  }
) {
  if (amount.includes('.')) {
    throw new Error('amount should be an integer string, without decimal');
  }
  if (amount.startsWith('-')) {
    throw new Error('amount should be a positive integer string');
  }
  const { gasBudget = '0' } = opts ?? {};
  // only SUI should be subtracted by gasBudget
  if (isSuiToken(coinType) && BigInt(gasBudget) > 0) {
    const max = BigInt(amount) - BigInt(gasBudget);
    if (max <= 0n) return '0';
    return String(max);
  }
  return amount;
}
