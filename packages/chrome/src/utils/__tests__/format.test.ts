import {
  addressEllipsis,
  formatCurrency,
  fullyFormatCurrency,
} from '../format';

describe('addressEllipsis', function () {
  test('correct scenario', function () {
    const suiAddress = '0x0000000000000000000000000000000000000000';
    expect(addressEllipsis(suiAddress)).toEqual('0x00000....0000');
  });
});

describe('currency display', function () {
  test('less than 7 digits, show original', () => {
    expect(formatCurrency('-1')).toEqual('0');
    expect(formatCurrency('0')).toEqual('0');
    expect(formatCurrency('9000000000')).toEqual('9');
    expect(formatCurrency('99000000000')).toEqual('99');
    expect(formatCurrency('999000000000')).toEqual('999');
    expect(formatCurrency('9999000000000')).toEqual('9,999');
    expect(formatCurrency('99999000000000')).toEqual('99,999');
    expect(formatCurrency('999999000000000')).toEqual('999,999');
  });

  test('less than 1, show original', () => {
    expect(formatCurrency('1123123')).toEqual('0.00112');
    expect(formatCurrency('10001')).toEqual('0.00001');
    expect(formatCurrency('1001')).toEqual('0.000001');
    // expect(formatCurrency('10001')).toEqual('0.01');
  });

  test('otherwise', () => {
    expect(formatCurrency('1000000000000000')).toEqual('1.000M');
    expect(formatCurrency('9999999000000000')).toEqual('9.999M');
    expect(formatCurrency('9999999999000000000')).toEqual('9.999B');
    expect(formatCurrency('9999999999999000000000')).toEqual('9.999T');
  });
});

describe('fullyFormatCurrency', function () {
  test('less than 7 digits, show original', () => {
    expect(fullyFormatCurrency('-1')).toEqual('0');
    expect(fullyFormatCurrency('0')).toEqual('0');
    expect(fullyFormatCurrency('9000000000')).toEqual('9');
    expect(fullyFormatCurrency('99000000000')).toEqual('99');
    expect(fullyFormatCurrency('999000000000')).toEqual('999');
    expect(fullyFormatCurrency('9999000000000')).toEqual('9,999');
    expect(fullyFormatCurrency('99999000000000')).toEqual('99,999');
    expect(fullyFormatCurrency('999999000000000')).toEqual('999,999');
  });

  test('less than 1, show original', () => {
    expect(fullyFormatCurrency('1123123')).toEqual('0.00112');
    expect(fullyFormatCurrency('10001')).toEqual('0.00001');
    expect(fullyFormatCurrency('1001')).toEqual('0.000001');
  });

  test('otherwise', () => {
    expect(fullyFormatCurrency('1000000000000000')).toEqual('1,000,000');
    expect(fullyFormatCurrency('9999999000000000')).toEqual('9,999,999');
    expect(fullyFormatCurrency('9999999999000000000')).toEqual('9,999,999,999');
    expect(fullyFormatCurrency('9999999999999000000000')).toEqual(
      '9,999,999,999,999'
    );
  });
});
