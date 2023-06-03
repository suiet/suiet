import dayjs from 'dayjs';

export default function orderTimeList(timeList: string[]): string[] {
  const res = [];
  const cp = timeList.slice();
  for (let nonDate of ['Today', 'Yesterday', 'This Week', 'Last Week']) {
    if (timeList.includes(nonDate)) {
      res.push(nonDate);
      cp.splice(cp.indexOf(nonDate), 1);
    }
  }
  cp.sort((a, b) => {
    return dayjs(b).valueOf() - dayjs(a).valueOf();
  });
  return res.concat(cp);
}

export { orderTimeList };
