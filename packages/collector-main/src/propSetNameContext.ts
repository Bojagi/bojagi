let currentPropSetName: string;
let currentPropSetKey: string;
let currentStoryPath: string;

export function setPropSetKey(newKey: string) {
  currentPropSetName = newKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  currentPropSetKey = newKey;
}

export function getPropSetName(): string {
  return currentPropSetName;
}

export function getPropSetKey(): string {
  return currentPropSetKey;
}

export function setStoryPath(newPath: string) {
  currentStoryPath = newPath
    .replace(/(\\|\/)/g, '__')
    .replace(/\./g, '_');
}

export function getStoryPath(): string {
  return currentStoryPath;
}
