import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { execSync } from 'child_process';
import { getBojagiBin, getResultFolder } from './bojagiPaths';
import { snapShotFileJSON } from './snapshots';

export * from './snapshots';
export * from './preview';
export * from './bojagiPaths';

const TEST_RESULT_FOLDER = path.resolve(__dirname, 'tmp');

export function reset(basePath) {
  optionalRm(getResultFolder(basePath));
  optionalRm(TEST_RESULT_FOLDER);
  fs.mkdirSync(TEST_RESULT_FOLDER, { recursive: true });
}

export function withTestResult(name, fn) {
  return (...args) => {
    writeTestResult(name, args);
    return fn(...args);
  };
}

export function writeTestResult(name, content) {
  fs.writeFileSync(
    path.resolve(TEST_RESULT_FOLDER, `${name}.json`),
    JSON.stringify(content, null, '  ')
  );
}

export function getTestResult(name) {
  return JSON.parse(
    fs.readFileSync(path.resolve(TEST_RESULT_FOLDER, `${name}.json`), { encoding: 'uft8' })
  );
}

export function snapshotTestResult(name) {
  snapShotFileJSON(path.resolve(TEST_RESULT_FOLDER, `${name}.json`));
}

function optionalRm(filePath) {
  try {
    fs.rmdirSync(filePath, { recursive: true });
  } catch (e) {
    console.log(`${filePath} not found - skipping deletion`);
  }
}

export function hash(aString) {
  const h = crypto.createHash('sha256');
  h.update(aString);
  return h.digest('hex');
}

export function execBojagi(basePath, cmd) {
  return execSync(`${getBojagiBin(basePath)} ${cmd}`, {
    cwd: basePath,
  }).toString();
}
