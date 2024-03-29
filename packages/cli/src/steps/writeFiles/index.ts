import * as path from 'path';
import { FileContent, StoryFileWithMetadata } from '../../types';
import { StepRunnerStep, StepRunnerActionOptions, StepOutput } from '../../containers/StepRunner';
import { ScanStepOutput } from '../scan';
import { CompileStepOutput } from '../compile';
import { AnalyzeStepOutput, StoryCollectionMetadata } from '../analyze';
import { writeJson } from '../../utils/writeFile';
import { buildManifest } from './buildManifest';
import { normalizeFilePath } from '../../utils/normalizeFilePath';
import { getStepOutputFiles } from '../../utils/getOutputFiles';
import { getStepOutputStories } from '../../utils/getOutputStories';
import { getStepOutputDependencies } from '../../utils/getOutputDependencies';
import { filterEmptyStories } from '../../utils/filterEmptyStories';
import { ConfigJson } from '../../storybook/types';
import { copyStaticFiles } from '../../utils/copyStaticFiles';
import { TEMP_FOLDER } from '../../constants';

export type WriteFilesStepOutput = StepOutput & {};

const IGNORE_FILES = [/.*?\.DS_Store$/];

const STORY_PROPERTY_WHITELIST: (keyof StoryFileWithMetadata | keyof StoryCollectionMetadata)[] = [
  'fileName',
  'filePath',
  'gitPath',
  'name',
  'namespace',
  'storyItems',
  'title',
  'files',
  'dependencies',
];
const FILE_PROPERTY_WHITELIST: (keyof FileContent)[] = ['name', 'namespace', 'outputFilePath'];

export const writeFilesStep: StepRunnerStep<WriteFilesStepOutput> = {
  action,
  emoji: 'pencil2',
  name: 'writeFiles',
  messages: {
    running: () => 'Write files',
    success: () => 'Files written',
    error: () => 'Error while writing files',
  },
};

type DependencyStepOutputs = {
  scan: ScanStepOutput;
  compile: CompileStepOutput;
  analyze: AnalyzeStepOutput;
};

async function action({ config, stepOutputs }: StepRunnerActionOptions<DependencyStepOutputs>) {
  const storiesMetadata = (stepOutputs.analyze && stepOutputs.analyze.storiesMetadata) || {};

  // Filter object properties by whitelist (so only relevant data is added to json files)
  const filesOutput = getStepOutputFiles(stepOutputs);
  const cleanFiles = filesOutput
    .filter(item => !IGNORE_FILES.find(ignoreRegExp => ignoreRegExp.test(item.fullOutputFilePath)))
    .map(mapObjectWithWhitelist(FILE_PROPERTY_WHITELIST))
    .map(item => ({
      ...item,
      outputFilePath: normalizeFilePath(item.outputFilePath),
    }));

  const storiesOutput = getStepOutputStories(stepOutputs);
  const cleanStories = storiesOutput
    .map(item => {
      const metadata = storiesMetadata[item.filePath] || {};
      return {
        ...metadata,
        ...item,
      };
    })
    .filter(filterEmptyStories)
    .map(mapObjectWithWhitelist(STORY_PROPERTY_WHITELIST));

  const dependenciesOutput = getStepOutputDependencies(stepOutputs);

  const staticFiles = await copyStaticFiles(
    config.staticDir.map(dir => path.join(config.executionPath, dir)),
    path.join(TEMP_FOLDER, config.namespace, 'files')
  );

  const manifest = buildManifest(stepOutputs.scan.reactVersion);

  const configJson: ConfigJson = {
    commit: config.commit,
  };

  const allFiles = [
    ...cleanFiles,
    ...staticFiles.map(staticFilePath => ({
      outputFilePath: path.join('files', staticFilePath),
      namespace: config.namespace,
      name: staticFilePath,
    })),
  ];

  await writeJson('manifest', manifest);
  await writeJson('config', configJson);
  await writeJson('files', allFiles, config.namespace);
  await writeJson('stories', cleanStories, config.namespace);
  await writeJson('dependencies', dependenciesOutput, config.namespace);

  return {};
}

function mapObjectWithWhitelist<T extends Record<K, any>, K extends string = string>(
  whitelist: K[]
) {
  return (item: T): { [x in K]: T[x] } =>
    Object.entries(item)
      .filter(([key]) => whitelist.includes(key as K))
      .reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: value,
        }),
        {} as { [x in K]: T[x] }
      );
}
