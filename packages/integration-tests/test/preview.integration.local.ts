import { startPreview, snapshotPreview, reset } from '@bojagi/integration-test-utils';
import { EXEC_PATH } from './config';

jest.setTimeout(180000);

test('run preview command', async () => {
  reset(EXEC_PATH);
  const { previewProcess, stories } = await startPreview(EXEC_PATH);
  try {
    console.log('snapshot testing');
    await snapshotPreview(stories);
    previewProcess.kill();
  } catch (e) {
    previewProcess.kill();
    console.error(e);
    throw e;
  }
});
