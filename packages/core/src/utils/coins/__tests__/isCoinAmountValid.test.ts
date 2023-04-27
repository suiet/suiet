import isCoinAmountValid from '../isCoinAmountValid';

describe('check if an amount is valid', function () {
  test('check if it is within the range', function () {
    expect(isCoinAmountValid('1')).toBe(true);

    expect(isCoinAmountValid('0')).toBe(false);
    expect(isCoinAmountValid('-1')).toBe(false);

    expect(isCoinAmountValid('1', '1')).toBe(true);
    expect(isCoinAmountValid('1.1', '1')).toBe(false);
    expect(isCoinAmountValid('2', '1')).toBe(false);
  });
});
