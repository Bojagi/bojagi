import { PREVIEW_CLIENT_FOLDER } from '../../constants';

import path = require('path');

export const ZIP_PATH = path.join(PREVIEW_CLIENT_FOLDER, 'local-dev-latest.zip');
export const DOWNLOAD_METADATA_FILE_PATH = path.join(
  PREVIEW_CLIENT_FOLDER,
  'downloadMetadata.json'
);
