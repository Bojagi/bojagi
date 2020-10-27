import { startPreview, snapshotPreview, deleteTmpFolder } from '@bojagi/integration-test-utils';
import { EXEC_PATH } from './config';

jest.setTimeout(120000);

test('run preview command', async () => {
  deleteTmpFolder(EXEC_PATH);
  const { previewProcess, stories } = await startPreview(EXEC_PATH);
  try {
    await snapshotPreview(stories);
    previewProcess.kill();
  } catch (e) {
    previewProcess.kill();
    console.error(e);
    throw e;
  }
});
