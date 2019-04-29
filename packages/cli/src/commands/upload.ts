import { BaseOptions } from '../baseCmd';
import withDefaultArguments from '../utils/withDefaultArguments';
import * as request from 'request-promise';
import * as AdmZip from 'adm-zip';
import withSteps from '../utils/withSteps';
import withHelloGoodbye from '../utils/withHelloGoodbye';
import withDeployValidator from '../validators/withDeployValidator';
import config from '../config';
import { getFS } from '../dependencies';
import { TEMP_FOLDER } from '../constants';
import * as path from 'path';

const fs = getFS();

export interface UploadCommandOptions extends BaseOptions {
  commit: string;
  steps: any;
}

export class AuthorizationError extends Error {
  hideStackTrace: boolean = true;
}

export class ServerError extends Error {
  hideStackTrace: boolean = true;
}

export const uploadAction = async ({ commit, steps }: UploadCommandOptions) => {
  const createComponentsStep = steps
    .advance('Creating components on Bojagi', 'seedling')
    .start();

  const apiSecret = process.env.BOJAGI_SECRET as string;
  let result;
  try {
    result = await createComponentsApiCall(commit, apiSecret);
    createComponentsStep.success('Components created on Bojagi', 'seedling');
  } catch (err) {
    createComponentsStep.error();
    const isAuthorizationError =
      err.error.errors &&
      err.error.errors[0].extensions.code === 'UNAUTHENTICATED';
    if (isAuthorizationError) {
      throw new AuthorizationError(
        'It seems your secret is wrong. Maybe it was revoked or renewed?'
      );
    }

    throw new ServerError(err.message);
  }

  const uploadComponentsStep = steps
    .advance('Uploading components', 'truck')
    .start();

  try {
    const uploadUrl = result.data.uploadCreate.uploadUrl;
    const zipFileContent = await createZipFile();
    await uploadZip(uploadUrl, zipFileContent);
  } catch (err) {
    uploadComponentsStep.error();
    throw new ServerError(err.message);
  }
  uploadComponentsStep.success(
    'Your components are ready to be viewed',
    'information_desk_person'
  );
};

async function createZipFile(): Promise<Buffer> {
  const zipFile = path.join(TEMP_FOLDER, 'upload.zip');
  const zip = new AdmZip();

  addFileToZip(zip, TEMP_FOLDER, 'files.json');
  addFileToZip(zip, TEMP_FOLDER, 'components.json');
  fs.readdirSync(`${TEMP_FOLDER}/files`)
    .map(file => `files/${file}`)
    .forEach(path => addFileToZip(zip, TEMP_FOLDER, path));

  fs.readdirSync(`${TEMP_FOLDER}/components`)
    .reduce((agg, folder) => {
      return [
        ...agg,
        ...fs
          .readdirSync(`${TEMP_FOLDER}/components/${folder}`)
          .map(file => `components/${folder}/${file}`)
      ];
    }, [])
    .forEach(path => addFileToZip(zip, TEMP_FOLDER, path));

  const content = zip.toBuffer();
  fs.writeFileSync(zipFile, content);
  return content;
}

function addFileToZip(zip, folder: string, fileName: string) {
  const fileContent = fs.readFileSync(`${folder}/${fileName}`);
  zip.addFile(fileName, fileContent);
}

function uploadZip(url: string, fileContent: Buffer) {
  return request({
    method: 'PUT',
    url,
    headers: {
      'Content-type': 'application/zip'
    },
    body: fileContent
  });
}

async function createComponentsApiCall(commit: string, apiSecret: string) {
  const query = `
	  mutation CreateUpload($commit: String!) {
      uploadCreate(commitId: $commit) {
        id
        uploadUrl
      }
    }
  `;

  const variables = { commit };

  return await request({
    method: 'POST',
    url: `${config.uploadApiUrl}/graphql`,
    headers: {
      'Content-type': 'application/json',
      authorization: `Secret ${apiSecret}`
    },
    json: true,
    body: {
      query,
      variables
    }
  });
}

const upload = program => {
  program
    .command('upload')
    .description('uploads your marked components to Bojagi (no bundling)')
    .option('-c, --commit [commit]', 'The commit to upload the components for')
    .action(
      withSteps(2)(
        withHelloGoodbye(
          withDefaultArguments(withDeployValidator(uploadAction))
        )
      )
    );
};

export default upload;
