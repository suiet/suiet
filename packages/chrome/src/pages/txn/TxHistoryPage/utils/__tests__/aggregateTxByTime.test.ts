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

  test('yesterday', () => {
    const today = dayjs('2023-01-07').valueOf();
    const yesterday = dayjs('2023-01-06').valueOf();
    expect(
      aggregateTxByTime(
        [
          {
            timestamp: yesterday,
          } as any,
        ],
        today
      )
    ).toEqual(new Map([['Yesterday', [{ timestamp: yesterday }]]]));
  });

  test('this week ( > 2 days and < 7 days)', () => {
    const today = dayjs('2023-01-07').valueOf();
    const thisWeek1 = dayjs('2023-01-05').valueOf();
    const thisWeek2 = dayjs('2023-01-01').valueOf();
    expect(
      aggregateTxByTime(
        [
          {
            timestamp: thisWeek1,
          } as any,
          {
            timestamp: thisWeek2,
          } as any,
        ],
        today
      )
    ).toEqual(
      new Map([
        [
          'This Week',
          [
            { timestamp: thisWeek1 },
            {
              timestamp: thisWeek2,
            },
          ],
        ],
      ])
    );
  });

  test('yesterday and last week', () => {
    const today = dayjs('2023-01-08').valueOf();
    const yesterday = dayjs('2023-01-07').valueOf();
    const aWeekAgo = dayjs('2023-01-06').valueOf();
    expect(
      aggregateTxByTime(
        [
          {
            timestamp: yesterday,
          } as any,
          {
            timestamp: aWeekAgo,
          } as any,
        ],
        today
      )
    ).toEqual(
      new Map([
        ['Yesterday', [{ timestamp: yesterday }]],
        ['Last Week', [{ timestamp: aWeekAgo }]],
      ])
    );
  });

  test('days before a week', () => {
    const today = dayjs('2023-01-08').valueOf();
    const daysBeforeAWeek = dayjs('2022-12-31').valueOf();
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
