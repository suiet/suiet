import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

import { TransactionForHistory } from '../hooks/useTransactionListForHistory';

export function aggregateTxByTime(
  txList: TransactionForHistory[],
  currentTimestamp: number
): Map<string, TransactionForHistory[]> {
  const res = new Map<string, TransactionForHistory[]>();

  const today = dayjs(currentTimestamp);
  const startOfWeek = today.startOf('week');
  const endOfWeek = today.endOf('week');
  const startOfLastWeek = today.subtract(1, 'week').startOf('week');
  const endOfLastWeek = today.subtract(1, 'week').endOf('week');

  function put(key: string, value: TransactionForHistory) {
    const list = res.get(key) ?? [];
    list.push(value);
    res.set(key, list);
  }

  txList.forEach((tx) => {
    const txDay = dayjs(tx.timestamp);

    if (txDay.isSame(today, 'day')) {
      put('Today', tx);
    } else if (txDay.isSame(today.subtract(1, 'day'), 'day')) {
      put('Yesterday', tx);
    } else if (txDay.isBetween(startOfWeek, endOfWeek, 'day', '[]')) {
      put('This Week', tx);
    } else if (txDay.isBetween(startOfLastWeek, endOfLastWeek, 'day', '[]')) {
      put('Last Week', tx);
    } else {
      put(txDay.format('MMM, YYYY'), tx);
    }
  });
  return res;
}
