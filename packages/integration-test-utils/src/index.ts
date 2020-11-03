import * as fs from 'fs';
import * as crypto from 'crypto';
import { execSync } from 'child_process';
import { getBojagiBin, getResultFolder } from './bojagiPaths';

export * from './snapshots';
export * from './preview';
export * from './bojagiPaths';

export function deleteTmpFolder(basePath) {
  try {
    fs.rmdirSync(getResultFolder(basePath), { recursive: true });
  } catch (e) {
    console.log('test fresh,no tmp folder to be deleted');
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
