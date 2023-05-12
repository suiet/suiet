import { TxnCategoryDto } from '../hooks/useTxnHistoryList';

export default function filterDuplicateTransactions(
  txList: TxnCategoryDto[]
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
