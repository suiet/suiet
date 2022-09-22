import { errorToString } from '../ui-api-client';

describe('Res Error toString', function () {
  test('print error {code: number; msg: string}', () => {
    expect(
      errorToString({
        code: -1,
        msg: 'error msg',
      })
    ).toEqual('error msg (code: -1)');
  });

  test('print error instanceof Error', () => {
    expect(errorToString(new Error('error msg'))).toEqual('error msg');
  });

  test('print error null | undefined', () => {
    expect(errorToString(null)).toEqual('null');
    expect(errorToString(undefined)).toEqual('unknown error');
  });
});
