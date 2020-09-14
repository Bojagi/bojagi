export function camelCaseToSpaces(input: string) {
  return input
    .replace(/([a-z])([A-Z0-9])/g, '$1 $2')
    .replace(/([0-9])([A-Za-z])/g, '$1 $2')
    .split(' ')
    .map(word => word.substr(0, 1).toUpperCase() + word.substr(1))
    .join(' ');
}
