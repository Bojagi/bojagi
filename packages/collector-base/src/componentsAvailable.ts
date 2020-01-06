import { fileExistsSync } from './fileUtils';

export function componentsAvailable(): boolean {
  return fileExistsSync('components.json');
}
