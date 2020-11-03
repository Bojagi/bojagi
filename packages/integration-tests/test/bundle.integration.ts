import { deleteTmpFolder, execBojagi, snapShotTmpFolder } from '@bojagi/integration-test-utils/src';
import { EXEC_PATH } from './config';

test('run bundle command', () => {
  deleteTmpFolder(EXEC_PATH);
  execBojagi(EXEC_PATH, 'bundle');
  snapShotTmpFolder(EXEC_PATH);
});
