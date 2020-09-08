import { loadConfigFile } from './loadConfigFile';

let fsMock;
let configContentResolverMock;
let configFilePrio;

beforeEach(() => {
  configContentResolverMock = jest.fn(() => ({ some: 'thing' })) as any;
  configFilePrio = [
    {
      path: '/abc/123.js',
      fn: configContentResolverMock,
    },
  ];
  fsMock = {
    existsSync: jest.fn(),
  };
});

test('Return config file content and the path of the file if file was found', () => {
  fsMock.existsSync.mockReturnValue(true);
  const result = loadConfigFile({
    fs: fsMock,
    configFilePrio,
  });

  expect(configContentResolverMock).toHaveBeenCalledTimes(1);
  expect(configContentResolverMock).toHaveBeenCalledWith('/abc/123.js');
  expect(result.configFile).toEqual({ some: 'thing' });
  expect(result.configFilePath).toEqual('/abc/123.js');
  expect(result.configFileDirectory).toEqual('/abc');
});

test('Return empty object for config file content if file was not found', () => {
  fsMock.existsSync.mockReturnValue(false);
  const result = loadConfigFile({
    fs: fsMock,
    configFilePrio,
  });

  expect(configContentResolverMock).toHaveBeenCalledTimes(0);
  expect(result).toEqual({ configFile: {}, configFileDirectory: process.cwd() });
});
