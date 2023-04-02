import formatTotalCoinChange from '../formatTotalCoinChange';

describe('format total coin change', function () {
  test('single coin', function () {
    expect(
      formatTotalCoinChange([
        {
          symbol: 'SUI',
          balance: '1000000000',
          metadata: {
            decimals: 9,
          },
        } as any,
      ])
    ).toEqual('+1 SUI');

    expect(
      formatTotalCoinChange([
        {
          symbol: 'SUI',
          balance: '+1000000000',
          metadata: {
            decimals: 9,
          },
        } as any,
      ])
    ).toEqual('+1 SUI');

    expect(
      formatTotalCoinChange([
        {
          symbol: 'SUI',
          balance: '-1000000000',
          metadata: {
            decimals: 9,
          },
        } as any,
      ])
    ).toEqual('-1 SUI');
  });
});
