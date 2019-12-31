let currentPropSetName;

export function setPropSetName(newName: string) {
  currentPropSetName = newName;
}

export function getPropSetName(): string {
  return currentPropSetName;
}
