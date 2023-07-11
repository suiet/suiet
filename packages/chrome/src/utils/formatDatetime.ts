import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import calendar from 'dayjs/plugin/calendar';
import relativeTime from 'dayjs/plugin/relativeTime';
export function formatDatetime(timestamp: number) {
  dayjs.extend(LocalizedFormat);
  dayjs.extend(calendar);
  // return dayjs(timestamp).format('lll');
  return dayjs(timestamp).calendar(null, {
    sameElse: 'lll',
  });
}

export function formateRelativetime(timestamp: number) {
  dayjs.extend(relativeTime);
  return dayjs(timestamp).fromNow();
}
