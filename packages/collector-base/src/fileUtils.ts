import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';
import { TEMP_FOLDER } from './constants';

export type WriteComponentPropsArgs = {
  exportName: string;
  filePath: string;
  props: Record<string, any>[];
};

const readFile = util.promisify(fs.readFile.bind(fs));
const mkdir = util.promisify(fs.mkdir.bind(fs));
const writeFile = util.promisify(fs.writeFile.bind(fs));

export function fileExistsSync(fileName: string): boolean {
  if (!fs.existsSync(TEMP_FOLDER)) {
    return false;
  }

  return fs.existsSync(path.join(TEMP_FOLDER, fileName));
}

export function readComponentsSync() {
  return readJsonSync('components');
}

export function readJsonSync(what: string) {
  const filePath = path.join(TEMP_FOLDER, `${what}.json`);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

export async function writeComponentProps({
  exportName,
  filePath,
  props,
}: WriteComponentPropsArgs) {
  const fileName = 'props.json';
  const fullPath = path.join(getComponentFolder(filePath, exportName), fileName);

  const existingProps = fs.existsSync(fullPath) ? JSON.parse(await readFile(fullPath)) : [];

  const fileContent = JSON.stringify([...existingProps, ...props]);
  return writeComponentFile({
    exportName,
    filePath,
    fileContent,
    fileName,
  });
}

function getComponentFolder(filePath: string, exportName: string) {
  const mappedPath = filePath.replace(/[/\\]/g, '__');
  const folder = `${mappedPath}___${exportName}`;
  return path.join(TEMP_FOLDER, 'components', folder);
}

async function writeComponentFile({ exportName, filePath, fileContent, fileName }) {
  const componentFolder = getComponentFolder(filePath, exportName);
  await mkdir(`${componentFolder}`, { recursive: true });

  await writeFile(path.join(componentFolder, fileName), fileContent);
}
