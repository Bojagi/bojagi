import { CollectorFunctionOptions } from '@bojagi/cli';
import { getComponents } from '@bojagi/collector-base';
import * as fs from 'fs';
import { promisify } from 'util';
import { getWebpackConfig } from './getWebpackConfig';
import { getBojagiFilePaths } from './getBojagiFilePaths';
import { createMockFileContent } from './createMockFile';
import { callBojagiStories } from './callBojagiStories';

const writeFilePromise = promisify(fs.writeFile);
const mkdirPromise = promisify<string, { recursive: boolean }, void>(fs.mkdir as any);

export * from './createExportFn';

export default async ({ webpack, components, executionPath }: CollectorFunctionOptions) => {
  const entries = await getBojagiFilePaths(executionPath);
  if (entries.length === 0) {
    return;
  }
  const entry: Record<string, string> = createEntry(entries);
  const componentPaths = components.map(component => component.filePath);
  const mockFileContent = createMockFileContent(getComponents());
  await mkdirPromise(`${executionPath}/.bojagi/tmp/collector/main/mocks/`, { recursive: true });
  await Promise.all(
    mockFileContent.map(([path, content]) =>
      writeFilePromise(
        `${executionPath}/.bojagi/tmp/collector/main/mocks/${path.replace(/\//g, '__')}`,
        content
      )
    )
  );

  const config = getWebpackConfig({
    executionPath,
    entry,
    componentPaths,
    webpack,
  });

  const compiler = webpack(config);
  await runCompiler(compiler);

  callBojagiStories(executionPath, entry);
};

function createEntry(entries: string[]) {
  return entries.reduce(
    (agg, path) => ({
      ...agg,
      [path.replace(/\//g, '__')]: `./${path}`,
    }),
    {}
  );
}

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
