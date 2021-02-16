import { withMemo } from './withMemo';

describe('withMemo', () => {
  test('return fn result', () => {
    const fn = jest.fn(() => 'result');
    const memorizedFn = withMemo(fn);

    expect(memorizedFn()).toEqual('result');
  });

  test('only call fn once for the same arguments', () => {
    const fn = jest.fn(() => 'result');
    const memorizedFn = withMemo(fn);

    expect(memorizedFn()).toEqual('result');
    expect(memorizedFn()).toEqual('result');

    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('call through for different arguments', () => {
    const fn = jest.fn(a => `result ${a}`);
    const memorizedFn = withMemo(fn);

    expect(memorizedFn('a')).toEqual('result a');
    expect(memorizedFn('b')).toEqual('result b');

    expect(fn).toHaveBeenCalledTimes(2);
  });

  test('respect multiple arguments', () => {
    const fn = jest.fn((a, b) => `result ${a} ${b}`);
    const memorizedFn = withMemo(fn);

    expect(memorizedFn('a', 1)).toEqual('result a 1');
    expect(memorizedFn('a', 1)).toEqual('result a 1'); // memorized
    expect(memorizedFn('a', 2)).toEqual('result a 2');

    expect(fn).toHaveBeenCalledTimes(2);
  });

  test('use custom keymap', () => {
    const fn = jest.fn((a, b) => `result ${a}`);
    const keyMap = jest.fn(() => 'myKey');
    const memorizedFn = withMemo(fn, keyMap);

    expect(memorizedFn('a')).toEqual('result a');
    expect(memorizedFn('b')).toEqual('result a');
    expect(memorizedFn('c')).toEqual('result a');

    expect(fn).toHaveBeenCalledTimes(1);
  });
});
