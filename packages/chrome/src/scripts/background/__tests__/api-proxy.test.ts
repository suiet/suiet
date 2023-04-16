import { normalizeMessageToParams } from '../utils/transmission';

jest.mock('lodash-es', () => ({
  has: (obj: Object, val: string) =>
    Object.prototype.hasOwnProperty.call(obj, val),
}));

describe('Port message process', function () {
  test('parse params', () => {
    const input = {
      id: '1',
      funcName: 'serviceA.funcB',
      payload: {
        key1: 'aaa',
      },
      options: {
        withAuth: true,
      },
    };
    expect(normalizeMessageToParams(input)).toEqual({
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
      normalizeMessageToParams({
        id: '1',
        funcName: 'funcC',
        payload: null,
        options: {
          withAuth: true,
        },
      })
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
    const expectErrorMsg = 'port message must be an object';
    expect(() =>
      normalizeMessageToParams({
        id: '1',
        funcName: 'serviceA.funcB',
        payload: {},
      })
    ).not.toThrow();
    expect(() => normalizeMessageToParams(undefined as any)).toThrow(
      expectErrorMsg
    );

    // if input is not de-serializable, throw
    expect(() =>
      normalizeMessageToParams(`{id: '1', funcName: errrrrrorr!`)
    ).toThrow(expectErrorMsg);

    // if object is not the required structure, throw error
    expect(() =>
      normalizeMessageToParams({
        id: undefined,
        funcName: undefined,
      })
    ).toThrow();
  });
});

export {};
