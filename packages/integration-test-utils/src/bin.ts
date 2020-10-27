import { getPreviewStories } from '@bojagi/integration-test-utils/src/preview';
import { snapshotPreview } from './index';

getPreviewStories()
  .then(snapshotPreview)
  .then(console.log, console.error);
