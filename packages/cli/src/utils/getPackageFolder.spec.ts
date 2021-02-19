import * as path from 'path';
import { getPackageFolder } from './getPackageFolder';

test('get path of a package', () => {
  expect(getPackageFolder('eslint')).toEqual(
    path.join(process.cwd(), 'node_modules', 'eslint').replace(/^\//, '')
  );
});
