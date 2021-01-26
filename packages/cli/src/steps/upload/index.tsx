import axios from 'axios';
import { StepRunnerStep, StepRunnerActionOptions } from '../../containers/StepRunner';
import { TEMP_FOLDER } from '../../constants';
import { getFS } from '../../dependencies';
import { CreateStoriesStepOutput } from '../createStories';
import { normalizeFilePath } from '../../utils/normalizeFilePath';

import path = require('path');
import AdmZip = require('adm-zip');

const MAX_ZIP_FILE_SIZE = 50000000; // 50mb

const fs = getFS();

export type UploadStepOutput = {};

export const uploadStep: StepRunnerStep<UploadStepOutput> = {
  action,
  emoji: 'truck',
  name: 'upload',
  messages: {
    running: () => 'Uploading components',
    success: () => 'Components successfully uploaded',
    error: () => 'Error during upload',
  },
};

type DependencyStepOutputs = {
  createStories: CreateStoriesStepOutput;
};

async function action({ stepOutputs }: StepRunnerActionOptions<DependencyStepOutputs>) {
  const { uploadUrl } = stepOutputs.createStories;
  const zipFileContent = await createZipFile('default');
  await uploadZip(uploadUrl, zipFileContent);

  return {};
}

async function createZipFile(namespace): Promise<Buffer> {
  const namespaceFolder = path.join(TEMP_FOLDER, namespace);
  const zipFile = path.join(TEMP_FOLDER, 'upload.zip');
  const zip = new AdmZip();

  // Add metadata files to
  addFileToZip(zip, TEMP_FOLDER, 'manifest.json');
  addFileToZip(zip, TEMP_FOLDER, path.join(namespace, 'files.json'));
  addFileToZip(zip, TEMP_FOLDER, path.join(namespace, 'stories.json'));

  // Add files to zip
  fs.readdirSync(path.resolve(namespaceFolder, 'files'))
    .map(file => path.join(namespace, 'files', file))
    .forEach(p => addFileToZip(zip, TEMP_FOLDER, p));

  const content = zip.toBuffer();
  fs.writeFileSync(zipFile, content);
  return content;
}

function addFolderToZip(zip, folder: string, fileName: string) {
  fs.readdirSync(path.resolve(folder, fileName)).forEach(p =>
    addFileToZip(zip, folder, path.join(fileName, p))
  );
}

function addFileToZip(zip, folder: string, fileName: string) {
  const currentPath = path.resolve(folder, fileName);

  if (fs.lstatSync(currentPath).isDirectory()) {
    addFolderToZip(zip, folder, fileName);
    return;
  }

  const fileContent = fs.readFileSync(currentPath);
  zip.addFile(normalizeFilePath(fileName), fileContent);
}

function uploadZip(url: string, fileContent: Buffer) {
  return axios.put(url, fileContent, {
    url,
    headers: {
      'Content-type': 'application/zip',
    },
    maxBodyLength: MAX_ZIP_FILE_SIZE,
  });
}
