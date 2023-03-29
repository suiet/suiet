import orderTimeList from '../orderTimeList';

describe('order time list', function () {
  test('order time list', function () {
    const timeList = [
      'Jan, 2023',
      'Last Week',
      'July, 2023',
      'Today',
      'Mar, 2023',
    ];
    const res = orderTimeList(timeList);
    expect(res).toEqual([
      'Today',
      'Last Week',
      'July, 2023',
      'Mar, 2023',
      'Jan, 2023',
    ]);
  });
});
