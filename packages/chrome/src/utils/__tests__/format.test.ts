import { addressEllipsis, formatCurrency } from '../format';

describe('addressEllipsis', function () {
  test('correct scenario', function () {
    const suiAddress = '0x0000000000000000000000000000000000000000';
    expect(addressEllipsis(suiAddress)).toEqual('0x00000....0000');
  });
});

describe('currency display', function () {
  test('less than 7 digits, show original', () => {
    expect(formatCurrency('0')).toEqual('0');
    expect(formatCurrency('9')).toEqual('9');
    expect(formatCurrency('99')).toEqual('99');
    expect(formatCurrency('999')).toEqual('999');
    expect(formatCurrency('9999')).toEqual('9,999');
    expect(formatCurrency('99999')).toEqual('99,999');
    expect(formatCurrency('999999')).toEqual('999,999');
  });

  test('otherwise', () => {
    expect(formatCurrency('1000000')).toEqual('1.000M');
    expect(formatCurrency('9999999')).toEqual('9.999M');
    expect(formatCurrency('9999999999')).toEqual('9.999B');
    expect(formatCurrency('9999999999999')).toEqual('9.999T');
  });
});
