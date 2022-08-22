import {helloWorld} from "../src/hello-world";

describe('test suits', () => {
  test('hello world', () => {
    expect(helloWorld()).toEqual('hello world')
  })
});