import { GetTxHistoryParams, Network, TxnHistoryEntry } from '@suiet/core';
import useSWR from 'swr';
import { useApiClient } from './useApiClient';
import { swrLoading } from '../utils/others';
import { swrKeyWithNetwork, useNetwork } from './useNetwork';

export const swrKey = 'getTransactionHistory';

function useTransactionList(address: string, networkId: string = 'devnet') {
  const apiClient = useApiClient();
  const { data: network } = useNetwork(networkId);
  const { data: history, error } = useSWR(
    [swrKeyWithNetwork(swrKey, network), address, network],
    getTransactionHistory
  );
  async function getTransactionHistory(
    _: string,
    address: string,
    network: Network
  ) {
    if (!address || !network) return null;
    const hs = await apiClient.callFunc<GetTxHistoryParams, TxnHistoryEntry[]>(
      'txn.getTransactionHistory',
      { network, address }
    );
    if (!hs) {
      throw new Error(
        `fetch getTransactionHistory failed: ${address}, ${networkId}`
      );
    }
    return hs;
  }

  console.log(history, address);

  return {
    history,
    error,
    loading: swrLoading(history, error),
  };
}

export default useTransactionList;
