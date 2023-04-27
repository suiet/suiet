import validateExternalWindowMsg from '../validateExternalWindowMsg';

describe('validateExternalWindowMsg', function () {
  test('validate msg structure', () => {
    expect(() => {
      validateExternalWindowMsg({
        target: 'SUIET_CONTENT',
        payload: {
          id: 'id',
          funcName: 'dapp.connect',
          payload: undefined,
        },
      } as any);
    }).not.toThrow();

    expect(() => {
      validateExternalWindowMsg({
        target: 'SUIET_CONTENT',
        payload: {
          id: 'id',
        },
      } as any);
    }).toThrow();

    expect(() => {
      validateExternalWindowMsg({
        target: 'SUIET_CONTENT',
        payload: {
          funcName: 'dapp.connect',
        },
      } as any);
    }).toThrow();
  });

  describe('test whitelist functions', function () {
    test('pass if functionName is in the whitelist', () => {
      const whileList = [
        'dapp.connect',
        'dapp.signTransactionBlock',
        'dapp.signAndExecuteTransactionBlock',
        'dapp.signMessage',
        'dapp.getAccountsInfo',
        'dapp.getActiveNetwork',
      ];
      expect(() => {
        whileList.forEach((funcName) => {
          validateExternalWindowMsg({
            target: 'SUIET_CONTENT',
            payload: {
              id: 'id',
              funcName: 'dapp.connect',
              payload: undefined,
            },
          } as any);
        });
      }).not.toThrow();
    });

    test('throws when functionName is not in the whitelist', () => {
      expect(() => {
        validateExternalWindowMsg({
          target: 'SUIET_CONTENT',
          payload: {
            id: 'id',
            funcName: 'dapp.notInWhiteList',
            payload: undefined,
          },
        } as any);
      }).toThrow();
    });
  });
});
