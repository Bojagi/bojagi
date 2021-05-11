import { normaliseConfig } from './normaliseConfig';

const DEFAULT_CONFIG = {
  webpackConfig: '__test__/webpack.config.js',
};
const CONFIG_FILE_DIR = __dirname;

const TEST_WEBPACK_CONFIG = require('./__test__/webpack.config');

test('Pipe input to output', async () => {
  expect(await normaliseConfig({ ...DEFAULT_CONFIG, a: 'b' } as any, CONFIG_FILE_DIR)).toEqual({
    a: 'b',
    staticDir: [],
    storyPath: [],
    storyPathIgnorePatterns: [],
    webpackConfig: TEST_WEBPACK_CONFIG,
  });
});

test('When storyPath is an array, keep value', async () => {
  expect(
    await normaliseConfig({ ...DEFAULT_CONFIG, storyPath: ['x'] } as any, CONFIG_FILE_DIR)
  ).toEqual({
    staticDir: [],
    storyPath: ['x'],
    storyPathIgnorePatterns: [],
    webpackConfig: TEST_WEBPACK_CONFIG,
  });
});

test('When storyPath is a string, make it an array of one string', async () => {
  expect(
    await normaliseConfig({ ...DEFAULT_CONFIG, storyPath: 'x' } as any, CONFIG_FILE_DIR)
  ).toEqual({
    staticDir: [],
    storyPath: ['x'],
    storyPathIgnorePatterns: [],
    webpackConfig: TEST_WEBPACK_CONFIG,
  });
});

test('When storyPathIgnorePatterns is an array, keep value', async () => {
  expect(
    await normaliseConfig(
      { ...DEFAULT_CONFIG, storyPathIgnorePatterns: ['x'] } as any,
      CONFIG_FILE_DIR
    )
  ).toEqual({
    staticDir: [],
    storyPath: [],
    storyPathIgnorePatterns: ['x'],
    webpackConfig: TEST_WEBPACK_CONFIG,
  });
});

test('When storyPathIgnorePatterns is a string, make it an array of one string', async () => {
  expect(
    await normaliseConfig(
      { ...DEFAULT_CONFIG, storyPathIgnorePatterns: 'x' } as any,
      CONFIG_FILE_DIR
    )
  ).toEqual({
    staticDir: [],
    storyPath: [],
    storyPathIgnorePatterns: ['x'],
    webpackConfig: TEST_WEBPACK_CONFIG,
  });
});

test('When staticDir is an array, keep value', async () => {
  expect(
    await normaliseConfig({ ...DEFAULT_CONFIG, staticDir: ['x'] } as any, CONFIG_FILE_DIR)
  ).toEqual({
    staticDir: ['x'],
    storyPath: [],
    storyPathIgnorePatterns: [],
    webpackConfig: TEST_WEBPACK_CONFIG,
  });
});

test('When staticDir is a string, make it an array of one string', async () => {
  expect(
    await normaliseConfig({ ...DEFAULT_CONFIG, staticDir: 'x' } as any, CONFIG_FILE_DIR)
  ).toEqual({
    staticDir: ['x'],
    storyPath: [],
    storyPathIgnorePatterns: [],
    webpackConfig: TEST_WEBPACK_CONFIG,
  });
});
