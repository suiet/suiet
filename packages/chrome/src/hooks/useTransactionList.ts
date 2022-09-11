import { GetTxHistoryParams, Network, TxnHistoryEntry } from '@suiet/core';
import useSWR from 'swr';
import { useApiClient } from './useApiClient';
import { swrLoading } from '../utils/others';
import { useNetwork } from './useNetwork';

function useTransactionList(
  address: string,
  opts: {
    networkId?: string;
  } = {}
) {
  const apiClient = useApiClient();
  const { networkId = 'devnet' } = opts;
  const { data: network } = useNetwork(networkId);
  const { data: history, error } = useSWR(
    ['getTransactionHistory', address, network],
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

  return {
    history,
    error,
    loading: swrLoading(history, error),
  };
}

export default useTransactionList;
