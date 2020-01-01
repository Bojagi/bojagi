import { createEntry } from './createEntry';

test('create entry object', () => {
  const output = createEntry(['a/b/c.ts', 'a.ts']);
  expect(output).toEqual({
    'a__b__c.ts': './a/b/c.ts',
    'a.ts': './a.ts',
  });
});
