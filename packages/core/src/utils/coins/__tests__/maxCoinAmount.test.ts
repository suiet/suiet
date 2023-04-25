import maxCoinAmount from '../maxCoinAmount';

jest.mock('@mysten/sui.js', () => ({
  SUI_TYPE_ARG: '0x2::sui::SUI',
}));

describe('calculate max coin amount', function () {
  test('only SUI should be subtracted by gasBudget', function () {
    expect(
      maxCoinAmount('0x2::sui::SUI', '1000000000', {
        gasBudget: '999999999',
      })
    ).toBe('1');
    expect(
      maxCoinAmount('0xwhatever::other::type', '1000000000', {
        gasBudget: '999999999',
      })
    ).toBe('1000000000');
  });
});
