import { FieldPolicy, gql, useQuery } from '@apollo/client';
import {
  CoinBalanceChangeItem,
  GetTransactionsParams,
  TransactionsData,
  TransactionsResult,
} from '../../../types/gql/transactions';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { isNonEmptyArray } from '../../../utils/check';

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

const GET_TX_LIST_GQL = gql`
  query getTransactions(
    $filter: TransactionsFilter
    $cursor: TransactionDigest
    $order: OrderDirection
    $limit: Int
  ) {
    transactions(
      filter: $filter
      cursor: $cursor
      order: $order
      limit: $limit
    ) {
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

// const outgoingData = {
//   transactions: {
//     transactions: [],
//     nextCursor: null,
//   },
// };
export function useTransactionListForHistory(address: string) {
  const [incomingNextCursor, setIncomingNextCursor] = useState<string | null>();
  const [outgoingNextCursor, setOutgoingNextCursor] = useState<string | null>();
  const LIMIT = null;
  const { data: incomingData, ...restForIncoming } = useQuery<
    TransactionsData<Omit<TransactionForHistory, 'type'>>,
    GetTransactionsParams
  >(GET_TX_LIST_GQL, {
    variables: {
      filter: {
        toAddress: address,
      },
      limit: LIMIT,
    },
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
      limit: LIMIT,
    },
    skip: !address,
  });

  const txHistoryList = useMemo(() => {
    let res: TransactionForHistory[] = [];
    if (incomingData?.transactions?.transactions) {
      console.log(
        'incomingData transactions',
        incomingData.transactions.transactions
      );

      res = res.concat(
        incomingData.transactions.transactions.map((tx) => ({
          ...tx,
          type: 'incoming',
        }))
      );
    }
    if (outgoingData?.transactions?.transactions) {
      console.log(
        'outgoingData transactions',
        outgoingData.transactions.transactions
      );

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
  }, [incomingData, outgoingData]);

  useEffect(() => {
    console.log('incomingData', incomingData);
    console.log('outgoingData', outgoingData);
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
  }, [restForIncoming, restForOutgoing]);

  const fetchMore = useCallback(() => {
    console.log('fetchMore');
    if (incomingNextCursor !== null) {
      console.log('fetchMore incomingNextCursor', incomingNextCursor);
      restForIncoming.fetchMore({
        variables: {
          filter: { toAddress: address },
          cursor: incomingNextCursor,
          limit: LIMIT,
        },
      });
    }
    if (outgoingNextCursor !== null) {
      console.log('fetchMore outgoingNextCursor', outgoingNextCursor);
      restForOutgoing.fetchMore({
        variables: {
          filter: { toAddress: address },
          cursor: outgoingNextCursor,
          limit: LIMIT,
        },
      });
    }
  }, [
    address,
    restForIncoming,
    incomingNextCursor,
    restForOutgoing,
    outgoingNextCursor,
  ]);

  return {
    data: txHistoryList,
    loading: restForIncoming.loading || restForOutgoing.loading,
    error: restForIncoming.error ?? restForOutgoing.error,
    refetch,
    fetchMore,
    hasMore,
  };
}

export function fieldPolicyForTransactions(): {
  transactions: FieldPolicy<
    TransactionsResult<Omit<TransactionForHistory, 'type'>>
  >;
} {
  return {
    // transactions: {
    //   keyArgs: ['filter'],
    //   merge(existing, incoming) {
    //     console.log('merge', existing, incoming);
    //     if (!existing) return incoming;
    //     const { transactions: newItems = [], nextCursor: newNextCursor } =
    //       incoming;
    //     const { transactions: existingItems = [] } = existing;
    //     let nextCursor: string | null = newNextCursor;
    //     if (newItems === null || !isNonEmptyArray(newItems)) {
    //       nextCursor = null;
    //     }
    //     return {
    //       transactions: [...existingItems, ...newItems],
    //       nextCursor,
    //     };
    //   },
    // },
  };
}

export default useTransactionListForHistory;
