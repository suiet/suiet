import { gql, QueryHookOptions, useLazyQuery, useQuery } from '@apollo/client';
import { useCallback, useMemo } from 'react';
import { LazyQueryHookOptions } from '@apollo/client/react/types/types';

export interface CoinDto {
  type: string;
  symbol: string;
  balance: string;
  decimals: number;
  isVerified: boolean;
}
export type CoinBalance = {
  balance: string;
  decimals: number;
};

const GET_COINS_GQL = gql`
  query getCoins($address: Address!) {
    coins(address: $address) {
      type
      balance
      symbol
      isVerified
      metadata {
        decimals
      }
    }
  }
`;

function formatCoinFromGql(coin: any): CoinDto {
  return {
    type: coin.type,
    symbol: coin.symbol,
    balance: coin.balance,
    isVerified: coin.isVerified,
    decimals: coin.metadata?.decimals ?? 0,
  };
}
/**
 * get coins
 * @param address
 * @param options
 */
export default function useCoins(address: string, options?: QueryHookOptions) {
  const { pollInterval = 5 * 1000, ...restOptions } = options || {};
  const { data, ...rest } = useQuery<{ coins: CoinDto[] }>(GET_COINS_GQL, {
    variables: {
      address,
    },
    pollInterval,
    skip: !address,
    ...restOptions,
  });
  const formattedData = useMemo(
    () => data?.coins?.map(formatCoinFromGql) ?? [],
    [data]
  );

  // reference by coin type
  const coinMap = useMemo(() => {
    const map: Map<string, CoinDto> = new Map();
    formattedData.forEach((coin) => {
      map.set(coin.type, coin);
    });
    return map;
  }, [formattedData]);

  const getCoinBalance = useCallback(
    (coinType: string): CoinBalance => {
      const coin = coinMap.get(coinType);
      // NOTE: why return an object instead of number or bigint? compatible for different usages
      // 1. For display, bigint would omit the fraction part, not accurate
      // 2. For calculation, balance could be huge, might exceed the max safe integer
      return {
        balance: coin?.balance ?? '0',
        decimals: coin?.decimals ?? 0,
      };
    },
    [formattedData]
  );

  return {
    data: formattedData,
    getCoinBalance,
    ...rest,
  };
}

export function useCoinsLazyQuery(options?: LazyQueryHookOptions) {
  const [getCoins, { data, ...rest }] = useLazyQuery<{ coins: CoinDto[] }>(
    GET_COINS_GQL,
    options
  );
  return [
    getCoins,
    {
      data: data?.coins?.map(formatCoinFromGql) ?? [],
      ...rest,
    },
  ];
}
