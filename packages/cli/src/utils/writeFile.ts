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

export async function getStoryFolder(namespace: string, filePath: string) {
  const mappedPath = filePath.replace(/[/\\]/g, '__');
  const folder = `${mappedPath}`;
  const namespaceFolder = await createNamespaceFolder(namespace);
  return path.join(namespaceFolder, 'stories', folder);
}

async function writeStoryFile({ namespace, filePath, fileContent, fileName }) {
  const storyFolder = await createStoryFolder({ namespace, filePath });
  const outputFilePath = path.join(storyFolder, fileName);
  await mkdirp(storyFolder, { fs });

  await writeFile(outputFilePath, fileContent);
  return outputFilePath;
}

export async function createStoryFolder({ namespace, filePath }): Promise<string> {
  const storyFolder = getStoryFolder(namespace, filePath);

  const folderExists = fs.existsSync(await storyFolder);

  if (!folderExists) {
    await mkdirp(`${storyFolder}`, { fs });
  }

  return storyFolder;
}

export async function writeStories(namespace: string, { filePath, fileContent }) {
  const fileName = 'stories.js';
  return writeStoryFile({
    filePath,
    namespace,
    fileContent,
    fileName,
  });
}

export async function writeSharedFile(namespace, name, fileContent) {
  const namespaceFolder = await createNamespaceFolder(namespace);
  const filesFolder = path.join(namespaceFolder, 'files');
  const filePath = path.join(filesFolder, `${name}.js`);
  await mkdirp(filesFolder, { fs });
  await writeFile(filePath, fileContent);
  return filePath;
}

export async function writeJson(what: string, content: object | any[], namespace?: string) {
  const namespaceFolder = await createNamespaceFolder(namespace);
  await writeFile(path.join(namespaceFolder, `${what}.json`), JSON.stringify(content));
}

export function readJsonSync(what: string) {
  const filePath = path.join(TEMP_FOLDER, `${what}.json`);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

export async function cleanTempFolder() {
  await rimraf(TEMP_FOLDER, fs);
}

async function createNamespaceFolder(namespace?: string) {
  const segments: string[] = [TEMP_FOLDER, namespace].filter(a => a) as any;
  const namespaceFolder = path.join(...segments);
  await mkdirp(namespaceFolder, { fs });
  return namespaceFolder;
}
