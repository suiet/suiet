import { TransactionForHistory } from '../hooks/useTransactionListForHistory';

export default function filterDuplicateTransactions(
  txList: TransactionForHistory[]
): any {
  const txDigests = new Set();
  return txList.filter((tx) => {
    if (txDigests.has(tx.digest)) {
      return false;
    }
    txDigests.add(tx.digest);
    return true;
  });
}
