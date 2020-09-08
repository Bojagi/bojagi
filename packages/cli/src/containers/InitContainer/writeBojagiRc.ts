import * as path from 'path';
import { getFS } from '../../dependencies';

const fileSystem = getFS();

export function writeBojagiRc(fs: typeof fileSystem, executionPath: string, answers: any) {
  const options = [['storyPath', answers.storyPath]];
  const bojagiRcContent = [
    'module.exports = {',
    ...options.map(o => `  ${o[0]}: '${o[1]}',`),
    '};',
  ];
  fs.writeFileSync(path.join(executionPath, '.bojagirc.js'), bojagiRcContent.join('\n'));
}
