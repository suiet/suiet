import { aggregateTxByTime } from '../aggregateTxByTime';
import dayjs from 'dayjs';

describe('aggregate tx items by time', function () {
  test('today', () => {
    const today = dayjs('2023-01-01').valueOf();
    expect(
      aggregateTxByTime(
        [
          {
            timestamp: today,
          } as any,
        ],
        today
      )
    ).toEqual(new Map([['Today', [{ timestamp: today }]]]));
  });

  test('today and last week', () => {
    const today = dayjs('2023-01-07').valueOf();
    const twoDaysAgo = dayjs('2023-01-05').valueOf();
    const aWeekAgo = dayjs('2023-01-01').valueOf();
    expect(
      aggregateTxByTime(
        [
          {
            timestamp: today,
          } as any,
          {
            timestamp: twoDaysAgo,
          } as any,
          {
            timestamp: aWeekAgo,
          } as any,
        ],
        today
      )
    ).toEqual(
      new Map([
        ['Today', [{ timestamp: today }]],
        ['Last Week', [{ timestamp: twoDaysAgo }, { timestamp: aWeekAgo }]],
      ])
    );
  });

  test('days before a week', () => {
    const today = dayjs('2023-01-08').valueOf();
    const daysBeforeAWeek = dayjs('2023-01-01').valueOf();
    expect(
      aggregateTxByTime(
        [
          {
            timestamp: daysBeforeAWeek,
          } as any,
        ],
        today
      )
    ).toEqual(
      new Map([
        [
          dayjs(daysBeforeAWeek).format('MMM, YYYY'),
          [{ timestamp: daysBeforeAWeek }],
        ],
      ])
    );
  });
});
