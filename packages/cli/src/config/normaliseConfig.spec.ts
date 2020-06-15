import { normaliseConfig } from './normaliseConfig';

test('Pipe input to output', () => {
  expect(normaliseConfig({ a: 'b' })).toEqual({
    a: 'b',
    storyPath: [undefined],
  });
});

test('When storyPath is an array, keep value', () => {
  expect(normaliseConfig({ storyPath: ['x'] })).toEqual({ storyPath: ['x'] });
});

test('When storyPath is a string, make it an array of one string', () => {
  expect(normaliseConfig({ storyPath: 'x' })).toEqual({ storyPath: ['x'] });
});
