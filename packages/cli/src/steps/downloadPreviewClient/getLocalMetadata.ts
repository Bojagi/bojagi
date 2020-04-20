import { PreviewDownloadMetadata } from './index';
import { getFS } from '../../dependencies';
import { DOWNLOAD_METADATA_FILE_PATH } from './constants';

const fs = getFS();

export function getLocalMetadata(): PreviewDownloadMetadata | undefined {
  if (fs.existsSync(DOWNLOAD_METADATA_FILE_PATH)) {
    return JSON.parse(fs.readFileSync(DOWNLOAD_METADATA_FILE_PATH).toString('utf8'));
  }
  return undefined;
}
