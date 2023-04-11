import formatTotalCoinChange from '../formatTotalCoinChange';

jest.mock('@suiet/core', () => ({
  formatCurrency: (value: string) => {
    if (value === '1000000000' || value === '+1000000000') return '1';
    if (value === '-1000000000') return '-1';
  },
}));

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
