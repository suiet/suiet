import { processPortMessage } from '../utils';

describe('Port message process', function () {
  test('de-serialized and get real params', () => {
    const input = JSON.stringify({
      id: '1',
      funcName: 'serviceA.funcB',
      payload: {
        key1: 'aaa',
      },
      options: {
        withAuth: true,
      },
    });
    expect(processPortMessage(input)).toEqual({
      id: '1',
      service: 'serviceA',
      func: 'funcB',
      payload: {
        key1: 'aaa',
      },
      options: {
        withAuth: true,
      },
    });
  });
  test('process funcName can be just func, which means call the root method', () => {
    expect(
      processPortMessage(
        JSON.stringify({
          id: '1',
          funcName: 'funcC',
          payload: null,
          options: {
            withAuth: true,
          },
        })
      )
    ).toEqual({
      id: '1',
      service: 'root',
      func: 'funcC',
      payload: null,
      options: {
        withAuth: true,
      },
    });
  });
  test('ensure input is a Json string that can be de-serialize to object', () => {
    const expectErrorMsg = 'port message must be a serialized json object';
    expect(() =>
      processPortMessage(
        JSON.stringify({
          id: '1',
          funcName: 'serviceA.funcB',
          payload: {},
        })
      )
    ).not.toThrow();
    expect(() => processPortMessage(undefined as any)).toThrow(expectErrorMsg);
    expect(() =>
      processPortMessage({
        id: '1',
        funcName: 'serviceA.funcB',
        payload: {},
      } as any)
    ).toThrow(expectErrorMsg);

    // if input is not de-serializable, throw
    expect(() => processPortMessage(`{id: '1', funcName: errrrrrorr!`)).toThrow(
      expectErrorMsg
    );

    // if de-serialized object is not the required structure, throw error
    expect(() =>
      processPortMessage(
        JSON.stringify({
          id: undefined,
          funcName: undefined,
        })
      )
    ).toThrow();
  });
});

export {};
