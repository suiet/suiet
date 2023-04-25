import { SUI_TYPE_ARG } from '@mysten/sui.js';

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
  const { gasBudget = '0' } = opts ?? {};
  // only SUI should be subtracted by gasBudget
  if (coinType === SUI_TYPE_ARG && BigInt(gasBudget) > 0) {
    return String(BigInt(amount) - BigInt(gasBudget));
  }
  return amount;
}
