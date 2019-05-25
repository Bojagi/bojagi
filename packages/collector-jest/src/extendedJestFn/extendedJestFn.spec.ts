import extendedJestFnFactory from './extendedJestFn';

let jestFn;
let extendedJestFn;

beforeEach(() => {
  jestFn = jest.fn;
  extendedJestFn = extendedJestFnFactory({ jestFn });
});

test('inject callPromise', () => {
  const mock = extendedJestFn(() => 'returnVal');
  expect(mock.mock).toBeDefined();
  expect(mock('1', '2')).toBe('returnVal');
  expect(mock.mock.callPromise).resolves.toEqual({
    returnValue: 'returnVal',
    args: ['1', '2']
  });
});
