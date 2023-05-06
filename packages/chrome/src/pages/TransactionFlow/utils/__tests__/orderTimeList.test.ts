import orderTimeList from '../orderTimeList';

describe('order time list', function () {
  test('order random time list', function () {
    const timeList = [
      'Jan, 2023',
      'Last Week',
      'July, 2023',
      'This Week',
      'Yesterday',
      'Today',
      'Mar, 2023',
    ];
    const res = orderTimeList(timeList);
    expect(res).toEqual([
      'Today',
      'Yesterday',
      'This Week',
      'Last Week',
      'July, 2023',
      'Mar, 2023',
      'Jan, 2023',
    ]);
  });
});
