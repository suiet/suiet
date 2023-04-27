import maxCoinAmount from '../maxCoinAmount';

jest.mock('@mysten/sui.js', () => ({
  SUI_TYPE_ARG: '0x2::sui::SUI',
}));

describe('only SUI should be subtracted by gasBudget', function () {
  test('with SUI', () => {
    expect(
      maxCoinAmount('0x2::sui::SUI', '1000000000', {
        gasBudget: '999999999',
      })
    ).toBe('1');
  });

  test('with SUI, return 0 when max amount is less than the budget', () => {
    expect(
      maxCoinAmount('0x2::sui::SUI', '1', {
        gasBudget: '2',
      })
    ).toBe('0');
  });

  test('with other type of coins', () => {
    expect(
      maxCoinAmount('0xwhatever::other::type', '1000000000', {
        gasBudget: '999999999',
      })
    ).toBe('1000000000');
  });

  test('throws when input is negative', () => {
    expect(() => {
      maxCoinAmount('0x2::sui::SUI', '-1');
    }).toThrow();
  });

  test('throws when input is with decimal', () => {
    expect(() => {
      maxCoinAmount('0x2::sui::SUI', '1.1');
    }).toThrow();
  });
});
