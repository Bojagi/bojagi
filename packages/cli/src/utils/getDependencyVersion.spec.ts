import { getDependencyVersion } from './getDependencyVersion';

test("Return undefined dependency wasn't found", () => {
  const reqMock = createReqMock(() => {
    throw new Error();
  });
  const result = getDependencyVersion('react', 'something', reqMock as any);
  expect(result).toBeUndefined();
});

test('Find dependency version when package exists', () => {
  const reqMock = createReqMock(() => ({
    version: '16.13.1',
  }));
  const result = getDependencyVersion('react', '/some/folder', reqMock as any);
  expect(result).toBe('16.13.1');
  expect(reqMock.resolve).toHaveBeenCalledWith('react/package.json', {
    paths: ['/some/folder', '/some'],
  });
  expect(reqMock).toHaveBeenCalledWith('some/thing');
});

function createReqMock(cb) {
  const reqMock: any = jest.fn(cb);
  reqMock.resolve = jest.fn(() => 'some/thing');
  return reqMock;
}
