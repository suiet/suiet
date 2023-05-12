import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

import { TxnCategoryDto } from '../hooks/useTxnHistoryList';
import isNonEmptyArray from '../../../../utils/check/isNonEmptyArray';

export function aggregateTxByTime(
  txList: TxnCategoryDto[],
  currentTimestamp: number
): Map<string, TxnCategoryDto[]> {
  const res = new Map<string, TxnCategoryDto[]>();

  const today = dayjs(currentTimestamp);
  const startOfWeek = today.startOf('week');
  const endOfWeek = today.endOf('week');
  const startOfLastWeek = today.subtract(1, 'week').startOf('week');
  const endOfLastWeek = today.subtract(1, 'week').endOf('week');

  function put(key: string, value: TxnCategoryDto) {
    const list = res.get(key) ?? [];
    list.push(value);
    res.set(key, list);
  }

  if (!isNonEmptyArray(txList)) return res;

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
