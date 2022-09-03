import { coreApi } from '@suiet/core';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

export enum CoinSymbol {
  SUI = 'SUI',
}

export function useCoinBalance(
  address: string,
  symbol: CoinSymbol,
  opts: {
    networkId?: string;
  } = {}
) {
  const [balance, setBalance] = useState<string>('0'); // BigInt -> string
  const { networkId = 'devnet' } = opts;
  const { data: coinsBalanceMap, error } = useSWR(
    ['fetchCoinsBalanceMap', address, networkId],
    fetchCoinsBalanceMap
  );

  async function fetchCoinsBalanceMap(
    _: string,
    address: string,
    networkId: string
  ) {
    const map = new Map<string, { balance: bigint; symbol: string }>();
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
      map.set(item.symbol, item);
    });
    return map;
  }

  useEffect(() => {
    if (!coinsBalanceMap) return;
    const result = coinsBalanceMap.get(symbol);
    setBalance(result?.balance ? String(result?.balance) : '0');
  }, [coinsBalanceMap, symbol]);

  return {
    balance,
    error,
    loading: !error && !coinsBalanceMap,
  };
}
