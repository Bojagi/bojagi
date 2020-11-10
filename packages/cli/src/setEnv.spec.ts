import setEnv from './setEnv';

let orgEnv;

beforeEach(() => {
  orgEnv = { ...process.env };
});

afterEach(() => {
  Object.assign(process.env, { ...orgEnv });
});

test('set NODE_ENV to development if not set', () => {
  delete process.env.NODE_ENV;
  setEnv();
  expect(process.env.NODE_ENV).toBe('production');
});

test('not set NODE_ENV if set', () => {
  process.env.NODE_ENV = 'something';
  setEnv();
  expect(process.env.NODE_ENV).toBe('something');
});

test('set BROWSERSLIST_IGNORE_OLD_DATA to true if not set', () => {
  delete process.env.BROWSERSLIST_IGNORE_OLD_DATA;
  setEnv();
  expect(process.env.BROWSERSLIST_IGNORE_OLD_DATA).toBe('true');
});

test('not set BROWSERSLIST_IGNORE_OLD_DATA if set', () => {
  process.env.BROWSERSLIST_IGNORE_OLD_DATA = 'false';
  setEnv();
  expect(process.env.BROWSERSLIST_IGNORE_OLD_DATA).toBe('false');
});

test('auto set CI option if debug is set', () => {
  delete process.env.CI;
  process.env.DEBUG = 'sth';
  setEnv();
  expect(process.env.CI).toBe('true');
  delete process.env.CI;
  delete process.env.DEBUG;
});

test('dont auto set CI option if debug is not set', () => {
  delete process.env.CI;
  delete process.env.DEBUG;
  setEnv();
  expect(process.env.CI).toBe(undefined);
  delete process.env.CI;
  delete process.env.DEBUG;
});
