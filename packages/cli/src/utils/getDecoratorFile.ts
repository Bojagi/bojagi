import * as pathUtils from 'path';
import * as fs from 'fs';
import glob from './glob';
import { Config } from '../config';
import { getPreviewFilePath } from '../storybook/getPreviewFilePath';
import { getSbOption } from '../storybook/getSbOption';

export async function getDecoratorFile(
  config: Config,
  innerGlob: typeof glob = glob,
  innerGetSbOption: typeof getSbOption = getSbOption,
  innerFs: typeof fs = fs
): Promise<string | undefined> {
  const bojagiDecoratorFiles = await innerGlob(config.decoratorPath, { cwd: config.executionPath });

  if (bojagiDecoratorFiles.length > 0) {
    return pathUtils.resolve(config.executionPath, bojagiDecoratorFiles[0]);
  }

  const sbDecoratorFile = getSbDecoratorFile(innerGetSbOption, innerFs);
  process.env.STORYBOOK_FOLDER = sbDecoratorFile;
  return sbDecoratorFile || undefined;
}

function getSbDecoratorFile(
  innerGetSbOption: typeof getSbOption,
  innerFs: typeof fs
): string | undefined {
  const configDir = innerGetSbOption('configDir', './.storybook');

  if (!configDir) {
    return undefined;
  }

  const storybookPreviewFilePath = getPreviewFilePath(configDir);

  return innerFs.existsSync(storybookPreviewFilePath)
    ? pathUtils.resolve(__dirname, '..', 'storybook', 'getDecorators.js')
    : undefined;
}
