import { useEffect, useState } from 'react';
import { swrLoading } from '../utils/others';
import { useCoins } from './useCoins';

export enum CoinSymbol {
  SUI = 'SUI',
}

export function useCoinBalance(
  symbol: CoinSymbol | null = null, // if null, means only lazy get function is available
  address: string,
  networkId: string = 'devnet'
) {
  const [balance, setBalance] = useState<string>('0');
  const {
    data: coinsBalance,
    getBalance,
    error,
    isValidating,
  } = useCoins(address, networkId);

  useEffect(() => {
    if (!coinsBalance || !symbol) return;
    setBalance(getBalance(symbol));
  }, [coinsBalance, symbol, getBalance]);

  return {
    balance,
    error,
    isValidating,
    loading: swrLoading(coinsBalance, error),
    getBalance,
  };
}
