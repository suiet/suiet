import compareCoinAmount from '../compareCoinAmount';

jest.mock('@mysten/sui.js', () => ({}));

describe('compareCoinAmount', function () {
  test('a > b', function () {
    expect(compareCoinAmount(1, 0)).toBe(1);
    expect(compareCoinAmount(1e-9, 0)).toBe(1);
  });
});
