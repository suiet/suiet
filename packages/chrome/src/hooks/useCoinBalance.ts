import { Network, GetOwnedObjParams } from '@suiet/core';
import { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import { swrLoading } from '../utils/others';
import { useApiClient } from './useApiClient';
import { useNetwork } from './useNetwork';

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
  const apiClient = useApiClient();
  const [balance, setBalance] = useState<string>('0');
  const { networkId = 'devnet' } = opts;
  const { data: network } = useNetwork(networkId);
  const {
    data: coinsBalanceMap,
    error,
    isValidating,
  } = useSWR(['fetchCoinsBalanceMap', address, network], fetchCoinsBalanceMap);

  async function fetchCoinsBalanceMap(
    _: string,
    address: string,
    network: Network
  ) {
    const map = new Map<string, string>();
    if (!address || !network) return map;

    const coinsBalance = await apiClient.callFunc<
      GetOwnedObjParams,
      Array<{ symbol: string; balance: string }>
    >('txn.getCoinsBalance', {
      network,
      address,
    });
    if (!coinsBalance) {
      throw new Error(`fetch coinsBalance failed: ${address}, ${networkId}`);
    }
    coinsBalance.forEach((item) => {
      map.set(item.symbol, item.balance);
    });

    return map;
  }

  const getBalance = useCallback(
    (symbol: string): string => {
      if (!symbol || !coinsBalanceMap) return '0';
      return coinsBalanceMap.get(symbol) ?? '0';
    },
    [coinsBalanceMap]
  );

  useEffect(() => {
    if (!coinsBalanceMap || !symbol) return;
    const result = coinsBalanceMap.get(symbol);
    setBalance(result ?? '0');
  }, [coinsBalanceMap, symbol]);

  return {
    balance,
    error,
    isValidating,
    loading: swrLoading(coinsBalanceMap, error),
    getBalance,
  };
}
