import { deleteTmpFolder, execBojagi, snapShotTmpFolder } from './utils';

test('run main collector', () => {
  deleteTmpFolder();
  execBojagi('bundle');
  execBojagi('runCollectors');
  snapShotTmpFolder();
});
