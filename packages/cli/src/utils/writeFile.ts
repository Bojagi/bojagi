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

export async function writeStories(namespace: string, { filePath, fileContent }) {
  return writeBojagiFile({
    filePath,
    namespace,
    fileContent,
  });
}

export async function writeBojagiFile({ namespace, folder, name, fileContent }) {
  const namespaceFolder = await createBojagiTempFolder(namespace);
  const filePath = path.join('files', `${name}.js`);
  const fullFilesFolder = path.join(namespaceFolder, folder);
  const fullFilesPath = path.join(namespaceFolder, filePath);
  await mkdirp(fullFilesFolder, { fs });
  await writeFile(filePath, fileContent);
  return { filePath, fullFilesPath };
}

export async function writeJson(what: string, content: object | any[], namespace?: string) {
  const namespaceFolder = await createBojagiTempFolder(namespace);
  await writeFile(path.join(namespaceFolder, `${what}.json`), JSON.stringify(content));
}

export function readJsonSync(what: string) {
  const filePath = path.join(TEMP_FOLDER, `${what}.json`);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

export async function cleanTempFolder() {
  await rimraf(TEMP_FOLDER, fs);
}

async function createBojagiTempFolder(internalPath?: string) {
  const segments: string[] = [TEMP_FOLDER, internalPath].filter(a => a) as any;
  const namespaceFolder = path.join(...segments);
  await mkdirp(namespaceFolder, { fs });
  return namespaceFolder;
}
