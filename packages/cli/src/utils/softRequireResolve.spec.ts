import * as path from 'path';
import { softRequireResolve } from './softRequireResolve';

test('return the path if file exists', () => {
  expect(softRequireResolve('./softRequireResolve')).toEqual(
    path.resolve(__dirname, 'softRequireResolve.ts')
  );
});

test('return undefined otherwise', () => {
  expect(softRequireResolve('./unkown')).toEqual(undefined);
});
