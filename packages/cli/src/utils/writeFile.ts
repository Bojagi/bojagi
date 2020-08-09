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

export function getStoryFolder(filePath: string) {
  const mappedPath = filePath.replace(/[/\\]/g, '__');
  const folder = `${mappedPath}`;
  return path.join(TEMP_FOLDER, 'stories', folder);
}

async function writeStoryFile({ filePath, fileContent, fileName }) {
  const storyFolder = await createStoryFolder({ filePath });
  const outputFilePath = path.join(storyFolder, fileName);
  await mkdirp(storyFolder, { fs });

  await writeFile(outputFilePath, fileContent);
  return outputFilePath;
}

export async function createStoryFolder({ filePath }): Promise<string> {
  const storyFolder = getStoryFolder(filePath);

  const folderExists = fs.existsSync(storyFolder);

  if (!folderExists) {
    await mkdirp(`${storyFolder}`, { fs });
  }

  return storyFolder;
}

export async function writeStories({ filePath, fileContent }) {
  const fileName = 'stories.js';
  return writeStoryFile({
    filePath,
    fileContent,
    fileName,
  });
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
