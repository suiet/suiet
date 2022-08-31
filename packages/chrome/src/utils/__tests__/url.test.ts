import {detectNestedPath} from "../url";

describe('detectNestedPath', function () {
  test('good cases', () => {
    expect(detectNestedPath('/a/b')).toEqual({
      isNested: true,
      paths: ['a', 'b'],
      lastPath: 'b',
    })
    expect(detectNestedPath('c/d')).toEqual({
      isNested: true,
      paths: ['c', 'd'],
      lastPath: 'd',
    })
    expect(detectNestedPath('/c/d/e/f/g')).toEqual({
      isNested: true,
      paths: ['c', 'd', 'e', 'f', 'g'],
      lastPath: 'g',
    })
    expect(detectNestedPath('c/d/e/f/g')).toEqual({
      isNested: true,
      paths: ['c', 'd', 'e', 'f', 'g'],
      lastPath: 'g',
    })
  })

  test('bad cases', () => {
    expect(detectNestedPath('/a')).toEqual({
      isNested: false,
      paths: ['a'],
      lastPath: 'a',
    })
    expect(detectNestedPath(undefined)).toEqual({
      isNested: false,
      paths: [],
      lastPath: '',
    })
  })
});