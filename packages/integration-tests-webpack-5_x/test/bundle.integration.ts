import {
  reset,
  execBojagi,
  snapShotTmpFolder,
  snapShotStaticFiles,
} from '@bojagi/integration-test-utils/src';
import { EXEC_PATH } from './config';

test('run bundle command', () => {
  reset(EXEC_PATH);
  execBojagi(EXEC_PATH, 'bundle -s static,public');
  snapShotTmpFolder(EXEC_PATH);
  snapShotStaticFiles(EXEC_PATH);
});
