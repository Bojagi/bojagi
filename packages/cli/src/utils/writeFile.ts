import { TEMP_FOLDER } from '../constants';
import { getFS } from '../dependencies';

import path = require('path');
import util = require('util');
import _rimraf = require('rimraf');
import _mkdirp = require('mkdirp');

export type WriteStoryMetadataArgs = {
  filePath: string;
  metadata: Record<string, any>;
};

const fs = getFS();

const mkdirp = util.promisify(_mkdirp);
const writeFile = util.promisify(fs.writeFile.bind(fs));
// const exists = util.promisify(fs.exists.bind(fs));
// const readFile = util.promisify(fs.readFile.bind(fs));
const rimraf = util.promisify(_rimraf);

export function getComponentFolder(filePath: string) {
  const mappedPath = filePath.replace(/[/\\]/g, '__');
  const folder = `${mappedPath}`;
  return path.join(TEMP_FOLDER, 'components', folder);
}

async function writeStoryFile({ filePath, fileContent, fileName }) {
  const componentFolder = await createComponentFolder({ filePath });
  const outputFilePath = path.join(componentFolder, fileName);
  await mkdirp(componentFolder, { fs });

  await writeFile(outputFilePath, fileContent);
  return outputFilePath;
}

export async function createComponentFolder({ filePath }): Promise<string> {
  const componentFolder = getComponentFolder(filePath);

  const folderExists = fs.existsSync(componentFolder);

  if (!folderExists) {
    await mkdirp(`${componentFolder}`, { fs });
  }

  return componentFolder;
}

export async function writeStories({ filePath, fileContent }) {
  const fileName = 'stories.js';
  return writeStoryFile({
    filePath,
    fileContent,
    fileName,
  });
}

export function readComponentsSync() {
  return readJsonSync('components');
}

export function fileExistsSync(fileName: string): boolean {
  if (!fs.existsSync(TEMP_FOLDER)) {
    return false;
  }

  return fs.existsSync(path.join(TEMP_FOLDER, fileName));
}

export async function writeStoryMetadata({ filePath, metadata }: WriteStoryMetadataArgs) {
  const fileName = 'metadata.json';
  // const fullPath = path.join(getComponentFolder(filePath), fileName);

  const fileContent = JSON.stringify(metadata);
  return writeStoryFile({
    filePath,
    fileContent,
    fileName,
  });
}

export function readComponentProps({ componentPath }): Record<string, any>[] {
  const componentFolder = getComponentFolder(componentPath);
  let props = [];
  try {
    props = require(path.join(componentFolder, 'props.json')) as any;
  } catch {
    props = [];
  }
  return props;
}

export async function writeSharedFile(name, fileContent) {
  const filesFolder = path.join(TEMP_FOLDER, 'files');
  const filePath = path.join(filesFolder, `${name}.js`);
  await mkdirp(filesFolder, { fs });
  await writeFile(filePath, fileContent);
  return filePath;
}

export async function writeJson(what: string, content: object | any[]) {
  await mkdirp(TEMP_FOLDER, { fs });
  await writeFile(path.join(TEMP_FOLDER, `${what}.json`), JSON.stringify(content));
}

export function readJsonSync(what: string) {
  const filePath = path.join(TEMP_FOLDER, `${what}.json`);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

export async function cleanTempFolder() {
  await rimraf(TEMP_FOLDER, fs);
}
