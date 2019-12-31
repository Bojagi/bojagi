import { promisify } from 'util';
import * as glob from 'glob';

const promiseGlob = promisify(glob);

export const getBojagiFilePaths = async (executionPath): Promise<string[]> => {
  return promiseGlob('src/**/*.bojagi.?(jsx|js)', {
    cwd: executionPath,
  });
};
