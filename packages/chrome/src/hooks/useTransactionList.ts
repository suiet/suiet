import { coreApi } from '@suiet/core';
import useSWR from 'swr';

function useTransactionList(
  address: string,
  opts: {
    networkId?: string;
  } = {}
) {
  const { networkId = 'devnet' } = opts;
  const { data: history, error } = useSWR(
    ['getTransactionHistory', address, networkId || 'devnet'],
    getTransactionHistory
  );
  async function getTransactionHistory(
    _: string,
    address: string,
    networkId: string
  ) {
    if (!address || !networkId) return null;
    const network = await coreApi.network.getNetwork(networkId);
    if (!network) {
      throw new Error(`fetch network failed: ${networkId}`);
    }

    const hs = await coreApi.txn.getTransactionHistory(network, address);
    if (!hs) {
      throw new Error(
        `fetch getTransactionHistory failed: ${address}, ${networkId}`
      );
    }
    return hs;
  }

  return {
    history,
    error,
    loading: !error && !history,
  };
}

export default useTransactionList;
