import { getDependencyVersion } from './getDependencyVersion';

test("Return undefined dependency wasn't found", () => {
  const reqMock = jest.fn(() => {
    throw new Error();
  });
  const result = getDependencyVersion('react', reqMock as any);
  expect(result).toBeUndefined();
});

test('Find dependency version when package exists', () => {
  const reqMock = jest.fn(() => ({
    version: '16.13.1',
  }));
  const result = getDependencyVersion('react', reqMock as any);
  expect(result).toBe('16.13.1');
});
