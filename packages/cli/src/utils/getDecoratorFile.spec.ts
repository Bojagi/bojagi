import * as pathUtils from 'path';
import { getDecoratorFile } from './getDecoratorFile';

let globMock;
let getSbOptionMock;
let fsMock;

beforeEach(() => {
  globMock = jest.fn(() => Promise.resolve([]));
  getSbOptionMock = jest.fn(key => key);
  fsMock = {
    existsSync: jest.fn(() => true),
  };
});

test('use Bojagi decorator files when found (priority 1)', async () => {
  globMock.mockReturnValueOnce(Promise.resolve(['abc.js']));
  const result = await callGetDecoratorFile();
  expect(result).toEqual('/some/abc.js');
  expect(globMock).toHaveBeenCalledWith('/some/decorators.js', { cwd: '/some/' });
});

test('use Storybook decorator files when found and no Bojagi decorators are there (priority 2)', async () => {
  globMock = jest.fn(() => Promise.resolve([]));
  const result = await callGetDecoratorFile();
  expect(result).toEqual(pathUtils.resolve(__dirname, '../storybook/getDecorators.js'));
});

test('use no decorator files when neither Storybook nor Bojagi decorators are there (priority 3)', async () => {
  globMock = jest.fn(() => Promise.resolve([]));
  getSbOptionMock = jest.fn(() => undefined);
  const result = await callGetDecoratorFile();
  expect(result).toBeUndefined();
});

test('use no decorator files when storybook is there but no preview.js file (priority 4)', async () => {
  globMock = jest.fn(() => Promise.resolve([]));
  getSbOptionMock = jest.fn(() => 'key');
  fsMock.existsSync = jest.fn(() => false);
  const result = await callGetDecoratorFile();
  expect(result).toBeUndefined();
});

function callGetDecoratorFile() {
  return getDecoratorFile(
    {
      decoratorPath: '/some/decorators.js',
      executionPath: '/some/',
    } as any,
    globMock,
    getSbOptionMock,
    fsMock
  );
}
