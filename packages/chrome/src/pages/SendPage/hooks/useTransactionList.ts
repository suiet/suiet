import { gql, useLazyQuery } from '@apollo/client';
import {
  TransactionsFilter,
  TransactionsResult,
} from '../../../types/gql/transactions';

const transactionsGql = gql`
  query Transactions(
    $fromAddress: Address
    $toAddress: Address
    $startTime: Timestamp
    $endTime: Timestamp
  ) {
    fromTransactions: transactions(
      filter: {
        fromAddress: $fromAddress
        startTime: $startTime
        endTime: $endTime
      }
    ) {
      transactions {
        status
      }
    }
    toTransactions: transactions(
      filter: {
        toAddress: $toAddress
        startTime: $startTime
        endTime: $endTime
      }
    ) {
      transactions {
        status
      }
    }
  }
`;

interface Transaction {
  status: string;
}

type Params = Omit<TransactionsFilter, 'mutatedObjectID' | 'inputObjectID'>;

function useTransactionList() {
  const [getTransactionList, { data, loading, error }] = useLazyQuery<
    {
      fromTransactions: TransactionsResult<Transaction>;
      toTransactions: TransactionsResult<Transaction>;
    },
    Params
  >(transactionsGql, {});

  let res: Transaction[] | null = null;

  if (data) {
    res = [];
    res = res.concat(data.fromTransactions.transactions || []);
    res = res.concat(data.toTransactions.transactions || []);
  }

  return {
    getTransactionList,
    data: res,
    loading,
    error,
  };
}

export default useTransactionList;
