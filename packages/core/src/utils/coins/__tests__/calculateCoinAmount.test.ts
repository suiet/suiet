import calculateCoinAmount from '../calculateCoinAmount';

describe('test calculateCoinAmount for amount * decimal precision', function () {
  test('', () => {
    expect(calculateCoinAmount('1', 0)).toBe('1');
    expect(calculateCoinAmount('1', 9)).toBe('1000000000');
    expect(calculateCoinAmount('111', 9)).toBe('111000000000');
    expect(calculateCoinAmount('123.123123123123', 0)).toBe('123');
    expect(calculateCoinAmount('123.123123123123', 9)).toBe('123123123123');
    expect(calculateCoinAmount('123.123', 50)).toBe('123123'.padEnd(53, '0'));
  });
  test('', () => {
    expect(() => {
      calculateCoinAmount('1', -1);
    }).toThrow();
  });
});
