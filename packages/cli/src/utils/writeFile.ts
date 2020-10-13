import { TEMP_FOLDER } from '../constants';
import { getFS } from '../dependencies';

import path = require('path');
import util = require('util');
import _rimraf = require('rimraf');

export type WriteStoryMetadataArgs = {
  filePath: string;
  metadata: Record<string, any>;
};

const fs = getFS();

const rimraf = util.promisify(_rimraf);

function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  return fs.promises.mkdir(dirname, { recursive: true });
}

export async function writeBojagiFile({ namespace, folder, fileName, fileContent }) {
  const namespaceFolder = await createBojagiTempFolder(namespace);
  const outputFilePath = path.join(folder, fileName);
  const fullOutputFilePath = path.join(namespaceFolder, outputFilePath);
  await ensureDirectoryExistence(fullOutputFilePath);
  await fs.promises.writeFile(fullOutputFilePath, fileContent);
  return { outputFilePath, fullOutputFilePath };
}

export async function writeJson(what: string, content: object | any[], namespace?: string) {
  const namespaceFolder = await createBojagiTempFolder(namespace);
  await fs.promises.writeFile(path.join(namespaceFolder, `${what}.json`), JSON.stringify(content));
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
  await ensureDirectoryExistence(namespaceFolder);
  return namespaceFolder;
}
