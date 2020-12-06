import * as path from 'path';

/**
 * Replace path separator with simple slash (eg. '\\' on windows with '/')
 * @param filePath full joined/resolved file path
 */
export function normalizeFilePath(filePath: string): string {
  return filePath.split(path.sep).join('/');
}
