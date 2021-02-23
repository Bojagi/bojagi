import * as path from 'path';
import { softRequireResolve } from './requireUtils';

test('return the path if file exists', () => {
  expect(softRequireResolve('./requireUtils')).toEqual(path.resolve(__dirname, 'requireUtils.ts'));
});

test('return undefined otherwise', () => {
  expect(softRequireResolve('./unknown')).toEqual(undefined);
});
