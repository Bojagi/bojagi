import axios from 'axios';
import { StepRunnerStep, StepRunnerActionOptions } from '../../containers/StepRunner';
import { TEMP_FOLDER } from '../../constants';
import { getFS } from '../../dependencies';
import { CreateStoriesStepOutput } from '../createStories';

import path = require('path');
import AdmZip = require('adm-zip');
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
  addFileToZip(zip, TEMP_FOLDER, `${namespace}/files.json`);
  addFileToZip(zip, TEMP_FOLDER, `${namespace}/stories.json`);

  // Add files to zip
  fs.readdirSync(`${namespaceFolder}/files`)
    .map(file => `${namespace}/files/${file}`)
    .forEach(p => addFileToZip(zip, TEMP_FOLDER, p));

  // Add stories to zip
  fs.readdirSync(`${namespaceFolder}/stories`)
    .map(file => `${namespace}/stories/${file}`)
    .forEach(p => addFileToZip(zip, TEMP_FOLDER, p));

  const content = zip.toBuffer();
  fs.writeFileSync(zipFile, content);
  return content;
}

function addFileToZip(zip, folder: string, fileName: string) {
  const fileContent = fs.readFileSync(`${folder}/${fileName}`);
  zip.addFile(fileName, fileContent);
}

function uploadZip(url: string, fileContent: Buffer) {
  return axios.put(url, fileContent, {
    url,
    headers: {
      'Content-type': 'application/zip',
    },
  });
}
