import { coreApi } from '@suiet/core';
import { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import { swrLoading } from '../utils/others';

export enum CoinSymbol {
  SUI = 'SUI',
}

export function useCoinBalance(
  address: string,
  symbol?: CoinSymbol,
  opts: {
    networkId?: string;
  } = {}
) {
  const [balance, setBalance] = useState<string>('0'); // BigInt -> string
  const { networkId = 'devnet' } = opts;
  const {
    data: coinsBalanceMap,
    error,
    isValidating,
  } = useSWR(
    ['fetchCoinsBalanceMap', address, networkId],
    fetchCoinsBalanceMap
  );

  async function fetchCoinsBalanceMap(
    _: string,
    address: string,
    networkId: string
  ) {
    const map = new Map<string, string>();
    if (!address || !networkId) return map;

    const network = await coreApi.network.getNetwork(networkId);
    if (!network) {
      throw new Error(`fetch network failed: ${networkId}`);
    }

    const coinsBalance = await coreApi.txn.getCoinsBalance(network, address);
    if (!coinsBalance) {
      throw new Error(`fetch coinsBalance failed: ${address}, ${networkId}`);
    }
    coinsBalance.forEach((item) => {
      map.set(item.symbol, String(item.balance));
    });

    return map;
  }

  const getBalance = useCallback(
    (symbol: string): string => {
      if (!symbol) return '0';
      return coinsBalanceMap?.get(symbol) ?? '0';
    },
    [coinsBalanceMap]
  );

  useEffect(() => {
    if (!coinsBalanceMap || !symbol) return;
    const result = coinsBalanceMap.get(symbol);
    setBalance(result ? String(result) : '0');
  }, [coinsBalanceMap, symbol]);

  return {
    balance,
    error,
    isValidating,
    loading: swrLoading(coinsBalanceMap, error),
    getBalance,
  };
}
