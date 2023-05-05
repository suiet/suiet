import useCoins, { CoinDto } from '../../../hooks/coin/useCoins';
import { useMemo } from 'react';
import { isNonEmptyArray } from '@suiet/core';
import { DEFAULT_SUI_COIN } from '../../../constants';

export default function useCoinsWithSuiOnTop(address: string) {
  const { data: coins, ...rest } = useCoins(address);
  const coinsWithSuiOnTop = useMemo(() => {
    if (isNonEmptyArray(coins)) {
      const suiCoin =
        coins.find((coin) => coin.symbol === 'SUI') ?? DEFAULT_SUI_COIN;
      const otherCoins = coins.filter((coin) => coin.symbol !== 'SUI');
      return [suiCoin, ...otherCoins] as CoinDto[];
    } else {
      return [DEFAULT_SUI_COIN];
    }
  }, [coins]);

  return { data: coinsWithSuiOnTop, ...rest };
}
