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
  console.log('input: ', address, symbol, opts);

  useEffect(() => {
    (async function () {
      const network = await coreApi.network.getNetwork(networkId);
      console.log('network', network);
      if (!network) return;
      const coinsBalance = await coreApi.txn.getCoinsBalance(network, address);
      console.log('coinsBalance', coinsBalance);
      const map = new Map();
      coinsBalance.forEach((item) => {
        map.set(item.symbol, item);
      });
      setCoinsBalanceMap(map);
    })();
  }, [address, networkId]);

  useEffect(() => {
    const result = coinsBalanceMap.get(symbol);
    setBalance(String(result?.balance) ?? '0');
  }, [coinsBalanceMap, symbol]);

  return balance;
}
