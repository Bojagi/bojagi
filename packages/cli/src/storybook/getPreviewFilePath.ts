import * as path from 'path';

export function getPreviewFilePath(configDir) {
  return path.resolve(configDir, 'preview.js');
}
