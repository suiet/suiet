import { gql, useQuery } from '@apollo/client';
import {
  CoinBalanceChangeItem,
  GetTransactionsParams,
  TransactionsData,
} from '../../../types/gql/transactions';
import { useCallback, useEffect, useMemo, useState } from 'react';

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

export function useTransactionListForHistory(address: string) {
  const [incomingNextCursor, setIncomingNextCursor] = useState<string | null>();
  const [outgoingNextCursor, setOutgoingNextCursor] = useState<string | null>();
  // const LIMIT = 2;
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
  });

  const txHistoryList = useMemo(() => {
    let res: TransactionForHistory[] = [];
    if (incomingData?.transactions?.transactions) {
      console.log('incomingData', incomingData.transactions.transactions);

      res = res.concat(
        incomingData.transactions.transactions.map((tx) => ({
          ...tx,
          type: 'incoming',
        }))
      );
    }
    if (outgoingData?.transactions?.transactions) {
      console.log('outgoingData', outgoingData.transactions.transactions);

      res = res.concat(
        outgoingData.transactions.transactions.map((tx) => ({
          ...tx,
          type: 'outgoing',
        }))
      );
    }
    // descending order by timestamp
    res.sort((a, b) => b.timestamp - a.timestamp);
    console.log('txList', res);
    return res;
  }, [incomingData, outgoingData]);

  useEffect(() => {
    if (incomingData?.transactions) {
      setIncomingNextCursor(incomingData.transactions.nextCursor);
    }
    if (outgoingData?.transactions) {
      setOutgoingNextCursor(outgoingData.transactions.nextCursor);
    }
  }, [incomingData, outgoingData]);

  const hasMore = incomingNextCursor || outgoingNextCursor;
  const refetch = useCallback(() => {
    restForIncoming.refetch();
    restForOutgoing.refetch();
  }, [restForIncoming, restForOutgoing]);

  const fetchMore = useCallback(() => {
    if (incomingNextCursor !== null) {
      restForIncoming.fetchMore({
        variables: {
          filter: { toAddress: address },
          cursor: incomingNextCursor,
          limit: LIMIT,
        },
      });
    }
    if (outgoingNextCursor !== null) {
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

export default useTransactionListForHistory;
