import { PREVIEW_CLIENT_FOLDER } from '../../constants';

import path = require('path');

export const CLIENT_FOLDER = path.join(PREVIEW_CLIENT_FOLDER);
export const LOCAL_DEV_ZIP = 'local-dev-latest.zip';
export const HEMINGWAY_ZIP = 'hemingway-latest.zip';
export const DOWNLOAD_METADATA_FILE_PATH = path.join(
  PREVIEW_CLIENT_FOLDER,
  'downloadMetadata.json'
);
