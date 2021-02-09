import axios from 'axios';
import { StepRunnerStep, StepRunnerActionOptions, StepOutput } from '../../containers/StepRunner';
import {
  PREVIEW_CLIENT_FOLDER,
  PREVIEW_CLIENT_OUTPUT_FOLDER,
  PREVIEW_CLIENT_VERSION,
} from '../../constants';
import { getFS } from '../../dependencies';
import { getLocalMetadata } from './getLocalMetadata';
import { downloadAndWriteClient } from './downloadAndWriteClient';
import { getSuccessMessage } from './getSuccessMessage';
import {
  CLIENT_FOLDER,
  LOCAL_DEV_ZIP,
  HEMINGWAY_ZIP,
  DOWNLOAD_METADATA_FILE_PATH,
} from './constants';

import AdmZip = require('adm-zip');
import path = require('path');

const fs = getFS();

export type DownloadPreviewClientStepOutput = StepOutput & {
  newClientDownload: boolean;
  localDevEtag?: string;
  hemingwayEtag?: string;
  newLocalDevEtag: string;
  newHemingwayEtag: string;
};

export type PreviewDownloadMetadata = {
  lastLocalDevEtag: string;
  lastHemingwayEtag: string;
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
  const baseUrl = `${config.previewDownloadUrl}/versions/${PREVIEW_CLIENT_VERSION}`;
  const localDevUrl = `${baseUrl}/local-dev-latest.zip`;
  const hemingwayUrl = `${baseUrl}/hemingway-latest.zip`;
  const zipOutputPath = PREVIEW_CLIENT_OUTPUT_FOLDER;

  if (!fs.existsSync(PREVIEW_CLIENT_FOLDER)) {
    fs.mkdirSync(PREVIEW_CLIENT_FOLDER);
  }

  const localMetadata = getLocalMetadata();

  if (localMetadata) {
    const localDevHeadRes = await axios.head(localDevUrl);
    const hemingwayHeadRes = await axios.head(hemingwayUrl);
    if (
      localDevHeadRes.headers.etag === localMetadata.lastLocalDevEtag &&
      hemingwayHeadRes.headers.etag === localMetadata.lastHemingwayEtag
    ) {
      return {
        newClientDownload: false,
        localDevEtag: localMetadata.lastLocalDevEtag,
        hemingwayEtag: localMetadata.lastHemingwayEtag,
        newLocalDevEtag: localDevHeadRes.headers.etag,
        newHemingwayEtag: hemingwayHeadRes.headers.etag,
      };
    }
  }

  const localDevEtag = await downloadAndWriteClient(localDevUrl, LOCAL_DEV_ZIP);
  const hemingwayEtag = await downloadAndWriteClient(hemingwayUrl, HEMINGWAY_ZIP);

  const localDevZip = new AdmZip(path.join(CLIENT_FOLDER, LOCAL_DEV_ZIP));
  localDevZip.extractAllTo(zipOutputPath, true);
  const hemingwayZip = new AdmZip(path.join(CLIENT_FOLDER, HEMINGWAY_ZIP));
  hemingwayZip.extractAllTo(path.join(zipOutputPath, 'hemingway'), true);

  fs.writeFileSync(
    DOWNLOAD_METADATA_FILE_PATH,
    JSON.stringify({
      lastLocalDevEtag: localDevEtag,
      lastHemingwayEtag: hemingwayEtag,
      lastDownloadDate: new Date().toISOString(),
    } as PreviewDownloadMetadata)
  );

  return {
    newClientDownload: true,
    localDevEtag: localMetadata && localMetadata.lastLocalDevEtag,
    hemingwayEtag: localMetadata && localMetadata.lastHemingwayEtag,
    newLocalDevEtag: localDevEtag,
    newHemingwayEtag: hemingwayEtag,
  };
}
