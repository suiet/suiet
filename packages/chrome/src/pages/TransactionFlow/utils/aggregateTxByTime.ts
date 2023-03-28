import dayjs from 'dayjs';
import { TransactionForHistory } from '../hooks/useTransactionListForHistory';

export function aggregateTxByTime(
  txList: TransactionForHistory[],
  currentTimestamp: number
): Map<string, TransactionForHistory[]> {
  const res = new Map<string, TransactionForHistory[]>();

  function put(key: string, value: TransactionForHistory) {
    const list = res.get(key) ?? [];
    list.push(value);
    res.set(key, list);
  }

  txList.forEach((tx) => {
    if (dayjs(tx.timestamp).isSame(currentTimestamp, 'day')) {
      put('Today', tx);
    } else if (dayjs(tx.timestamp).isSame(currentTimestamp, 'week')) {
      put('Last Week', tx);
    } else {
      put(dayjs(tx.timestamp).format('MMM, YYYY'), tx);
    }
  });
  return res;
}
