import { reset, execBojagi, snapShotTmpFolder, snapshotTestResult } from '@bojagi/integration-test-utils/src';
import { EXEC_PATH } from './config';

test('run bundle command', () => {
  reset(EXEC_PATH);
  execBojagi(EXEC_PATH, 'bundle');
  snapShotTmpFolder(EXEC_PATH);
  snapshotTestResult('storybookBabel')
  snapshotTestResult('storybookWebpackFinal')
});
