import * as path from 'path';
import { StepRunnerStep, StepRunnerActionOptions, StepOutput } from '../../containers/StepRunner';
import debuggers, { DebugNamespaces } from '../../debug';
import { getSbOption } from '../../storybook/getSbOption';
import { storybookIsInstalled } from '../../storybook/storybookUtils';
import { FileContent, OutputFileContent } from '../../types';
import { writeBojagiFile } from '../../utils/writeFile';

const debug = debuggers[DebugNamespaces.STORYBOOK];

export type StorybookStepOutput = StepOutput & {
  files: OutputFileContent<FileContent>[];
};

export const storybookStep: StepRunnerStep<StorybookStepOutput> = {
  action,
  if: () => storybookIsInstalled(),
  emoji: 'book',
  name: 'storybook',
  messages: {
    running: () => 'Get storybook metadata',
    success: () => 'Storybook metadata read',
    error: () => 'Error during getting storybook metadata',
  },
};

type DependencyStepOutputs = {};

async function action({
  config,
  fs,
}: StepRunnerActionOptions<DependencyStepOutputs>): Promise<StorybookStepOutput> {
  const { namespace, executionPath, storybookConfig } = config;
  const sbConfigDir = getSbOption('configDir', storybookConfig);
  const previewHeadPath = path.join(executionPath, sbConfigDir, 'preview-head.html');
  const previewBodyPath = path.join(executionPath, sbConfigDir, 'preview-body.html');
  const files: OutputFileContent<FileContent>[] = [];

  async function handlePreviewHtmlFile(fileName: string, fullPath: string) {
    if (fs.existsSync(fullPath)) {
      debug('Found storybook preview-%s file', fileName);
      const fileContent = fs.readFileSync(fullPath, 'utf8');
      const { outputFilePath, fullOutputFilePath } = await writeBojagiFile({
        namespace,
        fileName,
        fileContent,
        folder: 'files',
      });
      debug('wrote storybook preview-%s file to %s', fileName, fullOutputFilePath);
      files.push({
        name: fileName,
        fileContent,
        namespace,
        outputFilePath,
        fullOutputFilePath,
      });
    }
  }

  await handlePreviewHtmlFile('head.html', previewHeadPath);
  await handlePreviewHtmlFile('body.html', previewBodyPath);

  return {
    files,
  };
}
