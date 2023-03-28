import { gql, useLazyQuery } from '@apollo/client';
import {
  GetTransactionsParams,
  TransactionsData,
} from '../../../types/gql/transactions';

const transactionsGql = gql`
  query Transactions(
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
        digest
        category
        status
        gas {
          computationCost
          storageRebate
          storageCost
        }
        gasFee
        epoch
        signature
        timestamp
      }
      nextCursor
    }
  }
`;

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

function useTransactionList(params: GetTransactionsParams = {}) {
  const [getTransactionList, { data, loading, error }] = useLazyQuery<
    TransactionsData<Transaction>,
    GetTransactionsParams
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
