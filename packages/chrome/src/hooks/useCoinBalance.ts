import { useMemo } from 'react';
import { useCoins } from './useCoins';

export enum CoinSymbol {
  SUI = 'SUI',
}

export function useCoinBalance(
  symbol: CoinSymbol | null = null, // if null, means only lazy get function is available
  address: string,
  networkId: string
) {
  const {
    data: coinsBalance,
    getBalance,
    ...rest
  } = useCoins(address, networkId);

  const balance = useMemo(() => getBalance(symbol), [coinsBalance, symbol]);

  return {
    balance,
    getBalance,
    ...rest,
  };
}
