export function creatFilePropsKey(filePath: string, exportName: string) {
  return `${filePath}.${exportName}`;
}

export function createFilePropList(filePath: string, exportName: string) {
  return {
    filePath,
    exportName,
    props: []
  };
}
