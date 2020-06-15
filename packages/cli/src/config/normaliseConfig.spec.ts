import { normaliseConfig } from './normaliseConfig';

test('Pipe input to output', () => {
  expect(normaliseConfig({ a: 'b' } as any)).toEqual({
    a: 'b',
    storyPath: [undefined],
    storyPathIgnorePatterns: [undefined],
  });
});

test('When storyPath is an array, keep value', () => {
  expect(normaliseConfig({ storyPath: ['x'] } as any)).toEqual({
    storyPath: ['x'],
    storyPathIgnorePatterns: [undefined],
  });
});

test('When storyPath is a string, make it an array of one string', () => {
  expect(normaliseConfig({ storyPath: 'x' } as any)).toEqual({
    storyPath: ['x'],
    storyPathIgnorePatterns: [undefined],
  });
});

test('When storyPathIgnorePatterns is an array, keep value', () => {
  expect(normaliseConfig({ storyPathIgnorePatterns: ['x'] } as any)).toEqual({
    storyPath: [undefined],
    storyPathIgnorePatterns: ['x'],
  });
});

test('When storyPathIgnorePatterns is a string, make it an array of one string', () => {
  expect(normaliseConfig({ storyPathIgnorePatterns: 'x' } as any)).toEqual({
    storyPath: [undefined],
    storyPathIgnorePatterns: ['x'],
  });
});
