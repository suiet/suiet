import { useEffect, useState } from 'react';
import { useCoins } from './useCoins';

export enum CoinSymbol {
  SUI = 'SUI',
}

export function useCoinBalance(
  symbol: CoinSymbol | null = null, // if null, means only lazy get function is available
  address: string,
  networkId: string = 'devnet'
) {
  const {
    data: coinsBalance,
    getBalance,
    ...rest
  } = useCoins(address, networkId);

  return {
    balance: getBalance(symbol),
    getBalance,
    ...rest,
  };
}
