import axios from 'axios';
import { StepRunnerStep, StepRunnerActionOptions } from '../../containers/StepRunner';
import { TEMP_FOLDER } from '../../constants';
import { getFS } from '../../dependencies';
import { CreateComponentsStepOutput } from '../createComponents';

import path = require('path');
import AdmZip = require('adm-zip');
const fs = getFS();

export type UploadComponentsStepOutput = {};

export const uploadComponentsStep: StepRunnerStep<UploadComponentsStepOutput> = {
  action,
  emoji: 'truck',
  name: 'uploadComponents',
  messages: {
    running: () => 'Uploading components',
    success: () => 'Components successfully uploaded',
    error: () => 'Error during upload',
  },
};

type DependencyStepOutputs = {
  createComponents: CreateComponentsStepOutput;
};

async function action({ stepOutputs }: StepRunnerActionOptions<DependencyStepOutputs>) {
  const { uploadUrl } = stepOutputs.createComponents;
  const zipFileContent = await createZipFile();
  await uploadZip(uploadUrl, zipFileContent);

  return {};
}

async function createZipFile(): Promise<Buffer> {
  const zipFile = path.join(TEMP_FOLDER, 'upload.zip');
  const zip = new AdmZip();

  addFileToZip(zip, TEMP_FOLDER, 'files.json');
  addFileToZip(zip, TEMP_FOLDER, 'components.json');
  fs.readdirSync(`${TEMP_FOLDER}/files`)
    .map(file => `files/${file}`)
    .forEach(p => addFileToZip(zip, TEMP_FOLDER, p));

  fs.readdirSync(`${TEMP_FOLDER}/components`)
    .reduce((agg, folder) => {
      return [
        ...agg,
        ...fs
          .readdirSync(`${TEMP_FOLDER}/components/${folder}`)
          .map(file => `components/${folder}/${file}`),
      ];
    }, [])
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
