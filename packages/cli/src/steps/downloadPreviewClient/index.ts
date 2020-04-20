import axios from 'axios';
import { StepRunnerStep, StepRunnerActionOptions } from '../../containers/StepRunner';
import {
  PREVIEW_CLIENT_FOLDER,
  PREVIEW_CLIENT_OUTPUT_FOLDER,
  PREVIEW_CLIENT_VERSION,
} from '../../constants';
import { getFS } from '../../dependencies';
import { getLocalMetadata } from './getLocalMetadata';
import { downloadAndWriteClient } from './downloadAndWriteClient';
import { getSuccessMessage } from './getSuccessMessage';
import { ZIP_PATH, DOWNLOAD_METADATA_FILE_PATH } from './constants';

import AdmZip = require('adm-zip');

const fs = getFS();

export type DownloadPreviewClientStepOutput = {
  newClientDownload: boolean;
  localFileEtag?: string;
  newFileEtag: string;
};

export type PreviewDownloadMetadata = {
  lastEtag: string;
  lastDownloadDate: string;
};

export const downloadPreviewClientStep: StepRunnerStep<DownloadPreviewClientStepOutput> = {
  action,
  emoji: 'inbox_tray',
  name: 'downloadPreviewClient',
  messages: {
    running: () => 'Downloading preview client',
    success: getSuccessMessage,
    error: () => 'Error during preview client download',
  },
};

async function action({ config }: StepRunnerActionOptions) {
  const url = `${config.previewDownloadUrl}/versions/${PREVIEW_CLIENT_VERSION}/local-dev-latest.zip`;
  const zipOutputPath = PREVIEW_CLIENT_OUTPUT_FOLDER;

  if (!fs.existsSync(PREVIEW_CLIENT_FOLDER)) {
    fs.mkdirSync(PREVIEW_CLIENT_FOLDER);
  }

  const localMetadata = getLocalMetadata();

  if (localMetadata) {
    const headRes = await axios.head(url);
    if (headRes.headers.etag === localMetadata.lastEtag) {
      return {
        newClientDownload: false,
        localFileEtag: localMetadata.lastEtag,
        newFileEtag: headRes.headers.etag,
      };
    }
  }

  const etag = await downloadAndWriteClient(url);

  const zip = new AdmZip(ZIP_PATH);
  zip.extractAllTo(zipOutputPath, true);

  fs.writeFileSync(
    DOWNLOAD_METADATA_FILE_PATH,
    JSON.stringify({
      lastEtag: etag,
      lastDownloadDate: new Date().toISOString(),
    } as PreviewDownloadMetadata)
  );

  return {
    newClientDownload: true,
    localFileEtag: localMetadata && localMetadata.lastEtag,
    newFileEtag: etag,
  };
}
