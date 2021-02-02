import * as path from 'path';

export function getBojagiBin(basePath) {
  return path.resolve(basePath, 'node_modules', '.bin', 'bojagi');
}

export function getResultFolder(basePath) {
  return path.resolve(basePath, '.bojagi', 'tmp');
}
