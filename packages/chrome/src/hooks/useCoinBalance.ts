import { Network, GetOwnedObjParams } from '@suiet/core';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import { swrLoading } from '../utils/others';
import { useApiClient } from './useApiClient';
import { useNetwork } from './useNetwork';

export enum CoinSymbol {
  SUI = 'SUI',
}

export function useCoinBalance(
  address: string,
  symbol: CoinSymbol | null = null, // if null, means only lazy get function is available
  opts: {
    networkId?: string;
  } = {}
) {
  const apiClient = useApiClient();
  const [balance, setBalance] = useState<string>('0');
  const { networkId = 'devnet' } = opts;
  const { data: network } = useNetwork(networkId);
  const {
    data: coinsBalance,
    error,
    isValidating,
  } = useSWR(['fetchCoinsBalanceMap', address, network], fetchCoinsBalanceMap);

  const coinsBalanceMap = useMemo(() => {
    const map: Record<string, any> = {};
    if (!coinsBalance) return {};
    coinsBalance.forEach((item) => {
      map[item.symbol] = item.balance;
    });
    return map;
  }, [coinsBalance]);

  async function fetchCoinsBalanceMap(
    _: string,
    address: string,
    network: Network
  ) {
    if (!address || !network) return [];

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
    return coinsBalance;
  }

  const getBalance = useCallback(
    (symbol: string): string => {
      if (!symbol || !coinsBalanceMap) return '0';
      return coinsBalanceMap[symbol] ?? '0';
    },
    [coinsBalanceMap]
  );

  useEffect(() => {
    if (!coinsBalanceMap || !symbol) return;
    const result = coinsBalanceMap ? coinsBalanceMap[symbol] : undefined;
    setBalance(result ?? '0');
  }, [coinsBalanceMap, symbol]);

  return {
    balance,
    error,
    isValidating,
    loading: swrLoading(coinsBalance, error),
    getBalance,
  };
}
