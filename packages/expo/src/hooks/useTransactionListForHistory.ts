import { FieldPolicy, gql, useLazyQuery, useQuery } from '@apollo/client';
import { isNonEmptyArray } from '@suiet/core/src/utils';
// import { CoinBalanceChangeItem, GetTransactionsParams, TransactionsData, TransactionsResult } from '../utils/gql';
import { useCallback, useEffect, useMemo, useState } from 'react';

export interface TransactionsFilter {
  inputObjectID: string;
  mutatedObjectID: string;
  fromAddress: string;
  toAddress: string;
  startTime: number;
  endTime: number;
}

export interface GetTransactionsParams {
  filter?: Partial<TransactionsFilter>;
  cursor?: string;
  limit?: number;
  order?: 'ASC' | 'DESC';
}

export interface TransactionsData<T> {
  transactions: TransactionsResult<T>;
}

export interface TransactionsResult<T> {
  transactions: T[];
  nextCursor: string | null;
}

export interface CoinBalanceChangeItem {
  type: string;
  symbol: string;
  description: string;
  iconURL: string;
  balance: string;
  metadata: {
    objectID: string;
    decimals: number;
  };
  isVerified: boolean;
}

export interface GasResult {
  computationCost: number;
  storageCost: number;
  storageRebate: number;
}

export interface TransactionForHistory {
  type: 'incoming' | 'outgoing';
  kind: string;
  category: string;
  fromAddresses: string[] | null;
  toAddresses: string[] | null;
  status: string;
  gasFee: number;
  digest: string;
  signature: string;
  timestamp: number;
  coinBalanceChanges: CoinBalanceChangeItem[];
}

export interface TransactionListForHistoryQueryOption {
  limit?: number;
  fetchPolicy?: 'cache-first' | 'cache-and-network' | 'network-only';
}

const GET_TX_LIST_GQL = gql`
  query getTransactions($filter: TransactionsFilter, $cursor: TransactionDigest, $order: OrderDirection, $limit: Int) {
    transactions(filter: $filter, cursor: $cursor, order: $order, limit: $limit) {
      transactions {
        fromAddresses
        toAddresses
        category
        digest
        kind
        status
        gasFee
        signature
        timestamp
        coinBalanceChanges {
          type
          symbol
          description
          iconURL
          balance
          metadata {
            objectID
            decimals
          }
          isVerified
        }
      }
      nextCursor
    }
  }
`;

function useTransactionListForHistoryInternal(params: {
  address: string;
  incomingData: TransactionsData<Omit<TransactionForHistory, 'type'>> | undefined;
  outgoingData: TransactionsData<Omit<TransactionForHistory, 'type'>> | undefined;
  restForIncoming: any;
  restForOutgoing: any;
  limit: number | undefined;
}) {
  const { address, incomingData, outgoingData, restForIncoming, restForOutgoing, limit } = params;
  const [incomingNextCursor, setIncomingNextCursor] = useState<string | null>();
  const [outgoingNextCursor, setOutgoingNextCursor] = useState<string | null>();

  const txHistoryList = (() => {
    let res: TransactionForHistory[] = [];
    if (incomingData?.transactions?.transactions) {
      res = res.concat(
        incomingData.transactions.transactions.map((tx) => ({
          ...tx,
          type: 'incoming',
        }))
      );
    }
    if (outgoingData?.transactions?.transactions) {
      res = res.concat(
        outgoingData.transactions.transactions.map((tx) => ({
          ...tx,
          type: 'outgoing',
        }))
      );
    }
    // descending order by timestamp
    res.sort((a, b) => b.timestamp - a.timestamp);
    return res;
  })();

  useEffect(() => {
    if (incomingData?.transactions) {
      setIncomingNextCursor(incomingData.transactions.nextCursor);
    }
    if (outgoingData?.transactions) {
      setOutgoingNextCursor(outgoingData.transactions.nextCursor);
    }
  }, [incomingData, outgoingData]);

  const hasMore = !!incomingNextCursor || !!outgoingNextCursor;

  const refetch = useCallback(() => {
    restForIncoming.refetch();
    restForOutgoing.refetch();
  }, [restForIncoming.refetch, restForOutgoing.refetch]);

  const fetchMore = () => {
    if (incomingNextCursor !== null) {
      restForIncoming.fetchMore({
        variables: {
          filter: { toAddress: address },
          cursor: incomingNextCursor,
          limit,
        },
      });
    }
    if (outgoingNextCursor !== null) {
      restForOutgoing.fetchMore({
        variables: {
          filter: { toAddress: address },
          cursor: outgoingNextCursor,
          limit,
        },
      });
    }
  };

  return {
    data: txHistoryList,
    fetchMore,
    refetch,
    hasMore,
  };
}

export function useTransactionListForHistory(address: string, options?: TransactionListForHistoryQueryOption) {
  const { limit, fetchPolicy } = options ?? {};
  const { data: incomingData, ...restForIncoming } = useQuery<
    TransactionsData<Omit<TransactionForHistory, 'type'>>,
    GetTransactionsParams
  >(GET_TX_LIST_GQL, {
    variables: {
      filter: {
        toAddress: address,
      },
      limit,
    },
    fetchPolicy,
    skip: !address,
  });

  const { data: outgoingData, ...restForOutgoing } = useQuery<
    TransactionsData<Omit<TransactionForHistory, 'type'>>,
    GetTransactionsParams
  >(GET_TX_LIST_GQL, {
    variables: {
      filter: {
        fromAddress: address,
      },
      limit,
    },
    fetchPolicy,
    skip: !address,
  });

  const {
    data: txHistoryList,
    refetch,
    fetchMore,
    hasMore,
  } = useTransactionListForHistoryInternal({
    address,
    incomingData,
    outgoingData,
    limit,
    restForIncoming,
    restForOutgoing,
  });

  return {
    data: txHistoryList,
    loading: restForIncoming.loading || restForOutgoing.loading,
    error: restForIncoming.error ?? restForOutgoing.error,
    refetch,
    fetchMore,
    hasMore,
  };
}

export function useTransactionListForHistoryLazyQuery(address: string, options?: TransactionListForHistoryQueryOption) {
  const { limit, fetchPolicy } = options ?? {};
  const [queryIncomingData, { data: incomingData, ...restForIncoming }] = useLazyQuery<
    TransactionsData<Omit<TransactionForHistory, 'type'>>,
    GetTransactionsParams
  >(GET_TX_LIST_GQL, {
    variables: {
      filter: {
        toAddress: address,
      },
      limit: limit,
    },
    fetchPolicy,
  });

  const [queryOutgoingData, { data: outgoingData, ...restForOutgoing }] = useLazyQuery<
    TransactionsData<Omit<TransactionForHistory, 'type'>>,
    GetTransactionsParams
  >(GET_TX_LIST_GQL, {
    variables: {
      filter: {
        toAddress: address,
      },
      limit: limit,
    },
    fetchPolicy,
  });

  const {
    data: txHistoryList,
    refetch,
    fetchMore,
    hasMore,
  } = useTransactionListForHistoryInternal({
    address,
    incomingData,
    outgoingData,
    limit,
    restForIncoming,
    restForOutgoing,
  });

  const query = () => {
    queryIncomingData();
    queryOutgoingData();
  };

  return {
    query,
    data: txHistoryList,
    loading: restForIncoming.loading || restForOutgoing.loading,
    error: restForIncoming.error ?? restForOutgoing.error,
    refetch,
    fetchMore,
    hasMore,
  };
}

export function fieldPolicyForTransactions(): {
  transactions: FieldPolicy<TransactionsResult<Omit<TransactionForHistory, 'type'>>>;
} {
  return {
    transactions: {
      keyArgs: ['filter'],
      merge(existing, incoming) {
        // console.log('merge', existing, incoming);

        if (!existing) return incoming;

        let { transactions: existingItems = [], nextCursor: existingCursor } = existing;
        let { transactions: newItems = [], nextCursor: newNextCursor } = incoming;

        existingItems ??= [];
        newItems ??= [];

        // if there is no next cursor, it means there is no more data
        // incoming may come beacuse of react fast refresh
        if (existingCursor === null) {
          return existing;
        }

        return {
          transactions: [...existingItems, ...newItems],
          nextCursor: newNextCursor,
        };
      },
    },
  };
}

export default useTransactionListForHistory;
