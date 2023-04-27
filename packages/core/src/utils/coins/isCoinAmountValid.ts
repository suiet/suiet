import { compareCoinAmount } from '@suiet/chrome-ext/src/utils/check';

/**
 * Check if the amount is valid
 * @param amount must be positive value
 * @param max
 */
export default function isCoinAmountValid(amount: string, max?: string) {
  const isGreaterThanZero = compareCoinAmount(amount, '0') > 0;
  if (typeof max === 'string') {
    return isGreaterThanZero && compareCoinAmount(amount, max) <= 0;
  }
  return isGreaterThanZero;
}
