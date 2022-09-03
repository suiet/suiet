import { coreApi } from '@suiet/core';
import { useEffect, useState } from 'react';

export function useCoinBalance(
  address: string,
  symbol: string,
  opts: {
    networkId?: string;
  } = {}
) {
  const [balance, setBalance] = useState<string>('0'); // BigInt -> string
  const [coinsBalanceMap, setCoinsBalanceMap] = useState<
    Map<string, { symbol: string; balance: bigint }>
  >(new Map());
  const { networkId = 'devnet' } = opts;

  async function fetchCoinsBalanceMap(address: string, networkId: string) {
    const network = await coreApi.network.getNetwork(networkId);
    if (!network) {
      console.error(`fetch network failed: ${networkId}`);
      return;
    }

    const coinsBalance = await coreApi.txn.getCoinsBalance(network, address);
    if (!coinsBalance) {
      console.error(`fetch coinsBalance failed: ${address}, ${networkId}`);
      return;
    }
    const map = new Map();
    coinsBalance.forEach((item) => {
      map.set(item.symbol, item);
    });
    setCoinsBalanceMap(map);
  }

  useEffect(() => {
    if (!address || !networkId) return;
    fetchCoinsBalanceMap(address, networkId);
  }, [address, networkId]);

  useEffect(() => {
    const result = coinsBalanceMap.get(symbol);
    setBalance(result?.balance ? String(result?.balance) : '0');
  }, [coinsBalanceMap, symbol]);

  return balance;
}
