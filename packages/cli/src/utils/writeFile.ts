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

export type WriteBojagiFileOptions = {
  namespace: string;
  folder: string;
  fileName: string;
  fileContent: string | Buffer;
};

export type WriteBojagiFileOutput = {
  outputFilePath: string;
  fullOutputFilePath: string;
};

export type WriteBojagiFileFn = (options: WriteBojagiFileOptions) => Promise<WriteBojagiFileOutput>;

export const writeBojagiFile: WriteBojagiFileFn = async ({
  namespace,
  folder,
  fileName,
  fileContent,
}) => {
  const namespaceFolder = await createBojagiTempFolder(namespace);
  const outputFilePath = path.join(folder, fileName);
  const fullOutputFilePath = path.join(namespaceFolder, outputFilePath);
  await ensureDirectoryExistence(fullOutputFilePath);
  await fs.promises.writeFile(fullOutputFilePath, fileContent);
  return { outputFilePath, fullOutputFilePath };
};

export type WriteJsonFn = (
  what: string,
  content: object | any[],
  namespace?: string
) => Promise<void>;

export const writeJson: WriteJsonFn = async (what, content, namespace) => {
  const namespaceFolder = await createBojagiTempFolder(namespace);
  await fs.promises.writeFile(path.join(namespaceFolder, `${what}.json`), JSON.stringify(content));
};

export type ReadJsonFn = (what: string, namespace?: string) => Promise<Record<string, any>>;

export const readJson: ReadJsonFn = async (what, namespace) => {
  const namespaceFolder = await createBojagiTempFolder(namespace);
  const filePath = path.join(namespaceFolder, `${what}.json`);
  if (!fs.existsSync(filePath)) {
    return undefined;
  }

  const fileContent = await (
    await fs.promises.readFile(path.join(namespaceFolder, `${what}.json`))
  ).toString('utf-8');
  return JSON.parse(fileContent);
};

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
