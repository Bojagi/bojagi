import {
  getComponents,
  addProps,
  writeRegisteredProps,
  CollectorMetadata,
  CollectorFunctionOptions,
} from '@bojagi/collector-base';
import * as fs from 'fs';
import { promisify } from 'util';
import { getWebpackConfig } from './getWebpackConfig';
import { createMockFileContent } from './createMockFile';
import { callBojagiStories } from './callBojagiStories';
import { createEntry } from './createEntry';
import { getMocksPath } from './pathFactories';

import { createExportFnFactory } from './createExportFn';

const writeFilePromise = promisify(fs.writeFile);
const mkdirPromise = promisify<string, { recursive: boolean }, void>(fs.mkdir as any);
export const createExportFn = createExportFnFactory(addProps('Bojagi Collector'));

export default <CollectorMetadata>{
  name: 'Bojagi',
};

export const collector = async ({
  webpack,
  components,
  executionPath,
  storyFiles,
  projectWebpackConfig,
}: CollectorFunctionOptions) => {
  if (storyFiles.length === 0) {
    return;
  }
  const entry: Record<string, string> = createEntry(storyFiles);
  const componentPaths = components.map(component => component.filePath);
  const mockFileContent = createMockFileContent(getComponents());
  await mkdirPromise(getMocksPath(executionPath), { recursive: true });
  await Promise.all(
    mockFileContent.map(([path, content]) =>
      writeFilePromise(getMocksPath(executionPath, path.replace(/\//g, '__')), content)
    )
  );

  const config = getWebpackConfig({
    executionPath,
    entry,
    componentPaths,
    webpack,
    projectWebpackConfig,
  });

  const compiler = webpack(config as any);
  await runCompiler(compiler);

  callBojagiStories(executionPath, entry);
  writeRegisteredProps();
};

function runCompiler(compiler) {
  return new Promise((resolve, reject) =>
    compiler.run((err, compilerOutput) => {
      if (err || compilerOutput.compilation.errors.length > 0) {
        reject(err || compilerOutput.compilation.errors[0]);
      } else {
        resolve(compilerOutput);
      }
    })
  );
}
