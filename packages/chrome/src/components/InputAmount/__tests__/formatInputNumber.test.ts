import formatInputCoinAmount from '../formatInputCoinAmount';

describe('formatInputNumber', function () {
  test('normal inputs', function () {
    expect(formatInputCoinAmount('0')).toBe('0');
    expect(formatInputCoinAmount('1')).toBe('1');
    expect(formatInputCoinAmount('0.1')).toBe('0.1');
    expect(formatInputCoinAmount('0.1')).toBe('0.1');
    expect(formatInputCoinAmount('1.1')).toBe('1.1');
  });

  test('pending inputs', function () {
    expect(formatInputCoinAmount('0.')).toBe('0.');
    expect(formatInputCoinAmount('0.00')).toBe('0.00');
    expect(formatInputCoinAmount('1.')).toBe('1.');
  });

  test('invalid inputs', function () {
    expect(formatInputCoinAmount(undefined)).toBe('0');
    expect(formatInputCoinAmount('-1')).toBe('0');
    expect(formatInputCoinAmount('01')).toBe('1');
    expect(formatInputCoinAmount('00000001')).toBe('1');
    expect(formatInputCoinAmount('')).toBe('0');
    expect(formatInputCoinAmount('    ')).toBe('0');
    expect(formatInputCoinAmount('00000000')).toBe('0');
    expect(formatInputCoinAmount('.1')).toBe('0.1');
    expect(formatInputCoinAmount('0......')).toBe('0');
    expect(formatInputCoinAmount('0......1')).toBe('0.1');
    expect(formatInputCoinAmount('1.1.1')).toBe('1.11');
  });

  test('only allow digit and dot', function () {
    expect(formatInputCoinAmount('1112a')).toBe('1112');
    expect(formatInputCoinAmount('a')).toBe('0');
  });

  test('limit the decimal places', function () {
    expect(formatInputCoinAmount('0.1234567891', 9)).toBe('0.123456789');
    expect(formatInputCoinAmount('0.00000000001', 9)).toBe('0');
    expect(formatInputCoinAmount('1.1', 0)).toBe('1');
  });
});
