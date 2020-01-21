import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';

const EXEC_PATH = path.resolve(__dirname, '..');
const BOJAGI_BIN = path.resolve(EXEC_PATH, 'node_modules', '.bin', 'bojagi');
const RESULT_FOLDER = path.resolve(EXEC_PATH, '.bojagi', 'tmp');

function hash(aString) {
  const h = crypto.createHash('sha256');
  h.update(aString);
  return h.digest('hex');
}

function execBojagi(cmd) {
  return execSync(`${BOJAGI_BIN} ${cmd}`, {
    cwd: EXEC_PATH,
  }).toString();
}

function snapShotFileJSON(filePath) {
  expect(
    JSON.stringify(JSON.parse(fs.readFileSync(filePath, 'utf8')), null, ' ')
  ).toMatchSnapshot();
}

function snapShotFileHash(filePath) {
  expect(hash(fs.readFileSync(filePath, 'utf8'))).toMatchSnapshot();
}

test('bundle all components', () => {
  execBojagi('bundle');
  snapShotFileJSON(path.resolve(RESULT_FOLDER, 'files.json'));
  snapShotFileJSON(path.resolve(RESULT_FOLDER, 'components.json'));

  snapShotFileHash(path.resolve(RESULT_FOLDER, 'files', 'commons.js'));
  snapShotFileHash(
    path.resolve(RESULT_FOLDER, 'components', 'src__components__Box.js___default', 'component.js')
  );
  snapShotFileHash(
    path.resolve(
      RESULT_FOLDER,
      'components',
      'src__components__BoxWithButtons.js___default',
      'component.js'
    )
  );
  snapShotFileHash(
    path.resolve(
      RESULT_FOLDER,
      'components',
      'src__components__Button.js___default',
      'component.js'
    )
  );
});
