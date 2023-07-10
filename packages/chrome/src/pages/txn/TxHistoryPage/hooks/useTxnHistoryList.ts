import { FieldPolicy, gql, useQuery } from '@apollo/client';
import {
  GetTransactionsParams,
  TransactionsData,
  TransactionsResult,
} from '../../../../types/gql/transactions';
import { useCallback, useEffect, useMemo, useState } from 'react';
import filterDuplicateTransactions from '../utils/filterDuplicateTx';
import { DisplayItemDto } from '../../types';
import message from '../../../../components/message';
export type TxnCategoryDto = {
  digest: string;
  timestamp: number;
  display: {
    category: DisplayItemDto;
    summary: TxnSummaryDto[];
  };
};

export type TxnSummaryDto = {
  title: string;
  description: string;
  icon: string;
  assetChange: DisplayItemDto;
  assetChangeDescription: DisplayItemDto | null;
};

export interface TxnHistoryListQueryOption {
  limit?: number;
  fetchPolicy?: 'cache-first' | 'cache-and-network' | 'network-only';
}

const GET_TX_LIST_GQL = gql`
  query getTxnHistoryList(
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
      nextCursor
      transactions {
        digest
        timestamp
        display {
          category {
            text
            type
            color
            icon
          }
          summary {
            title
            description
            icon
            assetChange {
              text
              type
              color
              icon
            }
            assetChangeDescription {
              text
              type
              color
              icon
            }
          }
        }
      }
    }
  }
`;

/**
 * Get transaction history list
 * merge incoming and outgoing transactions
 * @param address
 * @param options
 */
export function useTxnHistoryList(
  address: string,
  options?: TxnHistoryListQueryOption
) {
  const { limit, fetchPolicy } = options ?? {};
  const [isRefetching, setIsRefetching] = useState(false);
  const { data: incomingData, ...restForIncoming } = useQuery<
    TransactionsData<TxnCategoryDto>,
    GetTransactionsParams
  >(GET_TX_LIST_GQL, {
    variables: {
      filter: {
        toAddress: address,
      },
      cursor: null,
      limit,
    },
    fetchPolicy,
    skip: !address,
    pollInterval: 0, // don't poll
  });

  const { data: outgoingData, ...restForOutgoing } = useQuery<
    TransactionsData<TxnCategoryDto>,
    GetTransactionsParams
  >(GET_TX_LIST_GQL, {
    variables: {
      filter: {
        fromAddress: address,
      },
      cursor: null,
      limit,
    },
    fetchPolicy,
    skip: !address,
    pollInterval: 0, // don't poll
  });

  const txHistoryList = useMemo(() => {
    let res: TxnCategoryDto[] = [];

    if (incomingData?.transactions?.transactions) {
      res = res.concat(incomingData.transactions.transactions);
    }
    if (outgoingData?.transactions?.transactions) {
      res = res.concat(outgoingData.transactions.transactions);
    }
    // filter duplicate tx
    res = filterDuplicateTransactions(res);
    // descending order by timestamp
    res.sort((a, b) => b.timestamp - a.timestamp);
    setIsRefetching(false);
    return res;
  }, [incomingData, outgoingData]);

  const refetch = useCallback(() => {
    setIsRefetching(true);

    // restForIncoming.client.resetStore();

    restForIncoming.client.refetchQueries({
      include: [GET_TX_LIST_GQL],
      // updateCache(cache) {
      //   cache.evict({ fieldName: 'transactions' });
      // },
      onQueryUpdated: () => {
        setTimeout(() => {
          setIsRefetching(false);
          // message.success('Refreshed');
        }, 500);
      },
    });
  }, [restForIncoming.refetch, restForOutgoing.refetch]);

  const fetchMore = async () => {
    // console.log('fetchMore incoming: ', incomingNextCursor);
    if (incomingData?.transactions?.nextCursor) {
      restForIncoming.fetchMore({
        variables: {
          filter: { toAddress: address },
          cursor: incomingData?.transactions?.nextCursor,
          limit,
        },
      });
    }
    if (outgoingData?.transactions?.nextCursor) {
      restForOutgoing.fetchMore({
        variables: {
          filter: { fromAddress: address },
          cursor: outgoingData?.transactions?.nextCursor,
          limit,
        },
      });
    }
  };

  // console.log('incomingData: ', incomingData?.transactions?.transactions);
  // console.log('outgoingData: ', outgoingData?.transactions?.transactions);
  // console.log('txHistoryList: ', txHistoryList);

  return {
    data: txHistoryList,
    loading: restForIncoming.loading || restForOutgoing.loading,
    error: restForIncoming.error ?? restForOutgoing.error,
    hasMore:
      !!incomingData?.transactions?.nextCursor ||
      !!outgoingData?.transactions?.nextCursor,
    refetch,
    fetchMore,
    isRefetching,
  };
}

function offsetFromCursor(
  items: TxnCategoryDto[],
  cursor: string,
  readField: any
) {
  for (let i = items.length - 1; i >= 0; --i) {
    const item = items[i];
    if (readField('digest', item) === cursor) {
      return i + 1;
    }
  }
  return -1;
}

export function fieldPolicyForTransactions(): {
  transactions: FieldPolicy<TransactionsResult<TxnCategoryDto> | undefined>;
} {
  return {
    transactions: {
      keyArgs: ['filter'],
      merge(
        existing: TransactionsResult<TxnCategoryDto> | undefined,
        incoming: TransactionsResult<TxnCategoryDto> | undefined,
        // @ts-expect-error
        { args: { cursor }, readField }
      ) {
        if (!existing) return incoming;
        if (!incoming) return existing;

        const { transactions: existingItems } = existing;
        const { transactions: incomingItems, nextCursor: newCursor } = incoming;
        const merged = existingItems ? existingItems.slice(0) : [];
        let offset = offsetFromCursor(merged, cursor, readField);

        if (offset < 0) offset = merged.length;
        for (let i = 0; i < incomingItems.length; ++i) {
          merged[offset + i] = incomingItems[i];
        }
        return {
          transactions: merged,
          nextCursor: newCursor,
        };
      },
    },
  };
}

export default useTxnHistoryList;
