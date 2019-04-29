import { fileExistsSync } from '../utils/writeFile';

export function componentsAvailable(): boolean {
  return fileExistsSync('components.json');
}
