import dayjs from 'dayjs';

export default function orderTimeList(timeList: string[]): string[] {
  const res = [];
  const cp = timeList.slice();
  if (timeList.includes('Today')) {
    res.push('Today');
    cp.splice(cp.indexOf('Today'), 1);
  }
  if (timeList.includes('Last Week')) {
    res.push('Last Week');
    cp.splice(cp.indexOf('Last Week'), 1);
  }
  cp.sort((a, b) => {
    return dayjs(b).valueOf() - dayjs(a).valueOf();
  });
  return res.concat(cp);
}
