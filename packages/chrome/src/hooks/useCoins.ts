import { Network, GetOwnedObjParams } from '@suiet/core';
import { useCallback, useMemo } from 'react';
import useSWR from 'swr';
import { swrLoading } from '../utils/others';
import { useApiClient } from './useApiClient';
import { useNetwork } from './useNetwork';

export interface Coin {
  symbol: string;
  balance: string;
}

export const swrKey = 'fetchCoinsBalanceMap';

export function useCoins(address: string, networkId: string = 'devnet') {
  const apiClient = useApiClient();
  const { data: network } = useNetwork(networkId);
  const {
    data: coins,
    error,
    isValidating,
  } = useSWR([swrKey, address, network], fetchCoinsBalanceMap, {
    refreshInterval: 5000,
  });

  const coinsBalanceMap = useMemo(() => {
    const map: Record<string, string> = {};
    if (!coins) return {};
    coins.forEach((item) => {
      map[item.symbol] = item.balance;
    });
    return map;
  }, [coins]);

  async function fetchCoinsBalanceMap(
    _: string,
    address: string,
    network: Network
  ) {
    if (!address || !network) return [];

    const coins = await apiClient.callFunc<GetOwnedObjParams, Coin[]>(
      'txn.getCoinsBalance',
      {
        network,
        address,
      }
    );
    if (!coins) {
      throw new Error(`fetch coinsBalance failed: ${address}, ${networkId}`);
    }
    return coins;
  }

  const getBalance = useCallback(
    (symbol: string): string => {
      if (!symbol || !coinsBalanceMap) return '0';
      return coinsBalanceMap[symbol] ?? '0';
    },
    [coinsBalanceMap]
  );

  return {
    data: coins,
    error,
    isValidating,
    loading: swrLoading(coins, error),
    getBalance,
  };
}
