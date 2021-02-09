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
    .map(mapObjectWithWhitelist(STORY_PROPERTY_WHITELIST));

  const manifest = buildManifest(stepOutputs.scan.reactVersion);

  await writeJson('manifest', manifest);
  await writeJson('files', cleanFiles, config.namespace);
  await writeJson('stories', cleanStories, config.namespace);

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
