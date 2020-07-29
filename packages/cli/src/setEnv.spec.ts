import setEnv from './setEnv';

const originalNodeEnv = process.env.NODE_ENV;

afterAll(() => {
  process.env.NODE_ENV = originalNodeEnv;
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
