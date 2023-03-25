import { GetTxHistoryParams, Network, TxnHistoryEntry } from '@suiet/core';
import useSWR from 'swr';
import { useApiClient } from './useApiClient';
import { swrLoading } from '../utils/others';
import { swrKeyWithNetwork, useNetwork } from './useNetwork';
import { useLazyQuery } from '@apollo/client';
import { transactionsGql } from '../utils/graphql/coins';

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

interface TransactionsFilter {
  inputObjectID: string;
  mutatedObjectID: string;
  fromAddress: string;
  toAddress: string;
  startTime: number;
  endTime: number;
}

interface Params {
  filter?: Partial<TransactionsFilter>;
  cursor?: string;
  limit?: number;
  order?: 'ASC' | 'DESC';
}

interface Transaction {
  digest: string;
  category: string;
  kind: string;
  status: string;
  gasFee: number;
  epoch: number;
  signature: string;
  timestamp: number;
}

interface TransactionsResult {
  transactions: Transaction[];
  nextCursor: string;
}

export function useTransactionListGql(params: Params = {}) {
  const [getTransactionList, { data, loading, error }] = useLazyQuery<
    { transactions: TransactionsResult },
    {
      filter?: Partial<TransactionsFilter>;
      cursor?: string;
      limit?: number;
      order?: 'ASC' | 'DESC';
    }
  >(transactionsGql, {
    variables: {
      ...params,
    },
  });

  return {
    getTransactionList,
    data: data?.transactions,
    loading,
    error,
  };
}

export default useTransactionList;
