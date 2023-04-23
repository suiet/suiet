import isSafeConvertToNumber from '../isSafeConvertToNumber';

describe('isSafeConvertToNumber', function () {
  test('input is number', function () {
    expect(isSafeConvertToNumber(9007199254740991)).toBe(true);
    expect(isSafeConvertToNumber(-9007199254740991)).toBe(true);

    expect(isSafeConvertToNumber(9007199254740992)).toBe(false);
    expect(isSafeConvertToNumber(-9007199254740992)).toBe(false);

    expect(isSafeConvertToNumber(1.1)).toBe(true);
    // rounding
    expect(isSafeConvertToNumber(9007199254740991.4)).toBe(true);
    expect(isSafeConvertToNumber(9007199254740991.5)).toBe(false);
  });
  test('input is string', function () {
    expect(isSafeConvertToNumber('9007199254740991')).toBe(true);
    expect(isSafeConvertToNumber('-9007199254740991')).toBe(true);

    expect(isSafeConvertToNumber('9007199254740992')).toBe(false);
    expect(isSafeConvertToNumber('-9007199254740992')).toBe(false);

    expect(isSafeConvertToNumber('1.1')).toBe(true);
  });
  test('input is bigint', function () {
    expect(isSafeConvertToNumber(BigInt(9007199254740991))).toBe(true);
    expect(isSafeConvertToNumber(BigInt(-9007199254740991))).toBe(true);

    expect(isSafeConvertToNumber(BigInt(9007199254740992))).toBe(false);
    expect(isSafeConvertToNumber(BigInt(-9007199254740992))).toBe(false);
  });
});
