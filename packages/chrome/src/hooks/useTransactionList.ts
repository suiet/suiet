import { GetTxHistoryParams, Network, TxnHistoryEntry } from '@suiet/core';
import { useApiClient } from './useApiClient';
import { swrKeyWithNetwork, useNetwork } from './useNetwork';
import { useLazyQuery } from '@apollo/client';
import { transactionsGql } from '../utils/graphql/coins';
import { useQuery } from 'react-query';

export const swrKey = 'getTransactionHistory';

function useTransactionList(address: string, networkId: string = 'devnet') {
  const apiClient = useApiClient();
  const { data: network } = useNetwork(networkId);
  const {
    data: history,
    error,
    ...rest
  } = useQuery(
    [swrKeyWithNetwork(swrKey, network), address, network],
    async () => await getTransactionHistory(address, network)
  );

  async function getTransactionHistory(
    address: string,
    network: Network | undefined
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
    ...rest,
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
