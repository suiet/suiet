import maxCoinAmountWithDecimal from '../maxCoinAmountWithDecimal';

jest.mock('@mysten/sui.js', () => ({
  SUI_TYPE_ARG: '0x2::sui::SUI',
}));

describe('calculate max coin amount with decimal', function () {
  test('only SUI should be subtracted by gasBudget', function () {
    expect(
      maxCoinAmountWithDecimal('0x2::sui::SUI', '1000000000', 9, {
        gasBudget: '100000000',
      })
    ).toBe('0.9');

    expect(
      maxCoinAmountWithDecimal('0x2::sui::SUI', '1000000000', 9, {
        gasBudget: '999999999',
      })
    ).toBe('0.000000001');
  });

  test('test with other type of coin', function () {
    expect(
      maxCoinAmountWithDecimal('0xwhatever::other::type', '1000000000', 9, {
        gasBudget: '999999999',
      })
    ).toBe('1');

    expect(
      maxCoinAmountWithDecimal('0xwhatever::other::type', '100000000', 9, {
        gasBudget: '999999999',
      })
    ).toBe('0.1');
  });

  test('if amount is less than gasBudget, return 0', function () {
    expect(
      maxCoinAmountWithDecimal('0x2::sui::SUI', '1000000000', 9, {
        gasBudget: '1000000001',
      })
    ).toBe('0');
  });
});
