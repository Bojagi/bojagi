import { normaliseConfig } from './normaliseConfig';

const DEFAULT_CONFIG = {
  webpackConfig: '',
};
const CONFIG_FILE_DIR = '/x/y';

test('Pipe input to output', () => {
  expect(normaliseConfig({ ...DEFAULT_CONFIG, a: 'b' } as any, CONFIG_FILE_DIR)).toEqual({
    a: 'b',
    storyPath: [undefined],
    storyPathIgnorePatterns: [undefined],
    webpackConfig: CONFIG_FILE_DIR,
  });
});

test('When storyPath is an array, keep value', () => {
  expect(normaliseConfig({ ...DEFAULT_CONFIG, storyPath: ['x'] } as any, CONFIG_FILE_DIR)).toEqual({
    storyPath: ['x'],
    storyPathIgnorePatterns: [undefined],
    webpackConfig: CONFIG_FILE_DIR,
  });
});

test('When storyPath is a string, make it an array of one string', () => {
  expect(normaliseConfig({ ...DEFAULT_CONFIG, storyPath: 'x' } as any, CONFIG_FILE_DIR)).toEqual({
    storyPath: ['x'],
    storyPathIgnorePatterns: [undefined],
    webpackConfig: CONFIG_FILE_DIR,
  });
});

test('When storyPathIgnorePatterns is an array, keep value', () => {
  expect(
    normaliseConfig({ ...DEFAULT_CONFIG, storyPathIgnorePatterns: ['x'] } as any, CONFIG_FILE_DIR)
  ).toEqual({
    storyPath: [undefined],
    storyPathIgnorePatterns: ['x'],
    webpackConfig: CONFIG_FILE_DIR,
  });
});

test('When storyPathIgnorePatterns is a string, make it an array of one string', () => {
  expect(
    normaliseConfig({ ...DEFAULT_CONFIG, storyPathIgnorePatterns: 'x' } as any, CONFIG_FILE_DIR)
  ).toEqual({
    storyPath: [undefined],
    storyPathIgnorePatterns: ['x'],
    webpackConfig: CONFIG_FILE_DIR,
  });
});

test('When webpackConfig is an absolute path, keep it', () => {
  expect(
    normaliseConfig({ ...DEFAULT_CONFIG, webpackConfig: '/a/b/c' } as any, CONFIG_FILE_DIR)
      .webpackConfig
  ).toEqual('/a/b/c');
});

test('When webpackConfig is just a word prepend config file path', () => {
  expect(
    normaliseConfig({ ...DEFAULT_CONFIG, webpackConfig: 'a/b/c' } as any, CONFIG_FILE_DIR)
      .webpackConfig
  ).toEqual(`${CONFIG_FILE_DIR}/a/b/c`);
});

test('When webpackConfig is a relative path prepend config file path', () => {
  expect(
    normaliseConfig({ ...DEFAULT_CONFIG, webpackConfig: './a/b/c' } as any, CONFIG_FILE_DIR)
      .webpackConfig
  ).toEqual(`${CONFIG_FILE_DIR}/a/b/c`);
});

test('When webpackConfig is a relative path 2 prepend config file path', () => {
  expect(
    normaliseConfig({ ...DEFAULT_CONFIG, webpackConfig: '../a/b/c' } as any, CONFIG_FILE_DIR)
      .webpackConfig
  ).toEqual(`/x/a/b/c`);
});
