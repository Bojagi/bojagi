import { deleteTmpFolder, execBojagi, snapShotTmpFolder } from './utils';

test('run bundle command', () => {
  deleteTmpFolder();
  execBojagi('bundle');

  snapShotTmpFolder();
});
