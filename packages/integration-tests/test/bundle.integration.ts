import { deleteTmpFolder, execBojagi, snapShotTmpFolder } from './utils';

test('run bundle command', () => {
  deleteTmpFolder();
  const result = execBojagi('bundle');
  console.log('result', result);

  snapShotTmpFolder();
});
