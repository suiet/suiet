import { Network, GetOwnedObjParams } from '@suiet/core';
import { useCallback, useEffect, useMemo } from 'react';
import { useApiClient } from './useApiClient';
import { swrKeyWithNetwork, useNetwork } from './useNetwork';
import { useLazyQuery } from '@apollo/client';
import { coinsGql } from '../utils/graphql/coins';
import { formatCurrency } from '../utils/format';
import { useQuery } from 'react-query';

export interface Coin {
  symbol: string;
  balance: string;
}

export const swrKey = 'fetchCoinsBalanceMap';

export function useCoins(address: string, networkId: string) {
  const apiClient = useApiClient();
  const { data: network } = useNetwork(networkId);
  const {
    data: coins,
    error,
    refetch,
    ...rest
  } = useQuery(
    [swrKeyWithNetwork(swrKey, network), address, network],
    async () => await fetchCoinsBalanceMap(address, network),
    {
      refetchInterval: 5000,
    }
  );
  const coinsBalanceMap = useMemo(() => {
    const map: Record<string, string> = {};
    if (!coins) return {};
    coins.forEach((item) => {
      map[item.symbol] = item.balance;
    });
    return map;
  }, [coins]);

  async function fetchCoinsBalanceMap(
    address: string,
    network: Network | undefined
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
    (symbol: string | null): string => {
      if (!symbol || !coinsBalanceMap) return '0';
      return coinsBalanceMap[symbol] ?? '0';
    },
    [coinsBalanceMap]
  );

  return {
    data: coins,
    mutate: refetch,
    error,
    loading: rest.isLoading,
    getBalance,
    ...rest,
  };
}

export interface Coins {
  balance: string;
  isVerified: boolean;
  iconURL: string;
  description: string;
  symbol: string;
  type: string;
  metadata: {
    decimals: number;
  };
}

export function useCoinsGql(
  address: string,
  defaultCoins: Coins[] = []
): {
  coins: Coins[];
  loading: boolean;
} {
  const [getCoins, { data, loading }] = useLazyQuery<{
    coins: Coins[];
  }>(coinsGql, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (address) {
      getCoins({
        variables: {
          address,
          coin: [],
        },
      });
    }
  }, [address]);

  if (!data) {
    return {
      coins: [],
      loading,
    };
  }

  const coins = data.coins || [];

  return {
    coins: coins.length > 0 ? coins : defaultCoins,
    loading,
  };
}
