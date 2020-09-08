import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';

export const EXEC_PATH = path.resolve(__dirname, '..');
export const BOJAGI_BIN = path.resolve(EXEC_PATH, 'node_modules', '.bin', 'bojagi');
export const RESULT_FOLDER = path.resolve(EXEC_PATH, '.bojagi', 'tmp', 'default');

export function deleteTmpFolder() {
  try {
    fs.rmdirSync(RESULT_FOLDER, { recursive: true });
  } catch (e) {
    console.log('test fresh,no tmp folder to be deleted');
  }
}

export function hash(aString) {
  const h = crypto.createHash('sha256');
  h.update(aString);
  return h.digest('hex');
}

export function execBojagi(cmd) {
  return execSync(`${BOJAGI_BIN} ${cmd}`, {
    cwd: EXEC_PATH,
  }).toString();
}

export function snapShotFileJSON(filePath) {
  expect(
    JSON.stringify(JSON.parse(fs.readFileSync(filePath, 'utf8')), null, ' ')
  ).toMatchSnapshot();
}

export function snapShotFileHash(filePath) {
  expect(hash(fs.readFileSync(filePath, 'utf8'))).toMatchSnapshot();
}

export function snapShotTmpFolder() {
  // TODO read all the files in dynamically, snapshot jsons, hash snapshots js files

  snapShotFileJSON(path.resolve(RESULT_FOLDER, 'files.json'));
  snapShotFileJSON(path.resolve(RESULT_FOLDER, 'stories.json'));
}
