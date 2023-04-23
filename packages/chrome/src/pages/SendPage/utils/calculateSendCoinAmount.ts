import { SendData } from '../types';
import { CoinDto } from '../../../hooks/coin/useCoins';
import { isSafeConvertToNumber } from '../../../utils/check';

export default function calculateSendCoinAmount(
  sendData: SendData,
  selectedCoin: CoinDto
): string {
  const { coinAmountWithDecimals } = sendData;
  let coinAmount: string;
  const precision = 10 ** selectedCoin.decimals;
  if (isSafeConvertToNumber(coinAmountWithDecimals)) {
    coinAmount = String(+coinAmountWithDecimals * precision);
  } else {
    coinAmount = String(BigInt(coinAmountWithDecimals) * BigInt(precision));
  }
  return coinAmount;
}
