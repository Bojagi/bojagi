import { getPreviewStories, snapshotPreview } from '@bojagi/integration-test-utils';
// import * as path from 'path';
import {
  deleteTmpFolder,
  // EXEC_PATH
} from './utils';

jest.setTimeout(30000);

test('run preview command', async () => {
  deleteTmpFolder();
  // const { previewProcess, stories } = await startPreview(EXEC_PATH);
  const stories = await getPreviewStories();
  try {
    console.log('stories', stories);
    await snapshotPreview(stories);

    console.log('all done');
    await new Promise(resolve => setTimeout(resolve, 5000));
    // previewProcess.kill();
  } catch (e) {
    // previewProcess.kill();
    console.error(e);
    throw e;
  }
});
