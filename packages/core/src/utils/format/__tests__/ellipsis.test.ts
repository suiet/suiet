import ellipsis from '../ellipsis';

describe('shorten long strings', function () {
  test(
    'should preserve only the first 6 and last 4 characters' +
      ' if the string is longer than 8',
    function () {
      expect(ellipsis('123456789')).toBe('123456...6789');
      expect(ellipsis('11111234567892222')).toBe('111112...2222');
    }
  );

  test(
    'should show own string' +
      ' if the len of string is shorter than or equal to 8',
    function () {
      expect(ellipsis('12345678')).toBe('12345678');
    }
  );
  test('should return String(value) that is not a string', function () {
    expect(ellipsis(undefined)).toBe('undefined');
    expect(ellipsis(null)).toBe('null');
  });
});
