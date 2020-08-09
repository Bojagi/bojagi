import { FileContent, StoryFileWithMetadata } from '@bojagi/types';
import { StepRunnerStep, StepRunnerActionOptions } from '../../containers/StepRunner';
import { ScanStepOutput } from '../scan';
import { CompileStepOutput } from '../compile';
import { AnalyzeStepOutput, StoryCollectionMetadata } from '../analyze';
import { writeJson } from '../../utils/writeFile';

export type WriteFilesStepOutput = {};

export type BojagiNamespace = {
  name: string;
  framework: 'react';
};

export type BojagiManifest = {
  version: '2';
  namespaces: BojagiNamespace[];
};

const DEFAULT_MANIFEST: BojagiManifest = {
  version: '2',
  namespaces: [
    {
      name: 'default',
      framework: 'react',
    },
  ],
};

const STORY_PROPERTY_WHITELIST: (keyof StoryFileWithMetadata | keyof StoryCollectionMetadata)[] = [
  'fileName',
  'filePath',
  'gitPath',
  'name',
  'stories',
  'title',
];
const FILE_PROPERTY_WHITELIST: (keyof FileContent)[] = ['name'];

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

async function action({ stepOutputs }: StepRunnerActionOptions<DependencyStepOutputs>) {
  const storiesMetadata = (stepOutputs.analyze && stepOutputs.analyze.storiesMetadata) || {};

  // Filter object properties by whitelist (so only relevant data is added to json files)
  const cleanFiles = stepOutputs.compile.files.map(mapObjectWithWhitelist(FILE_PROPERTY_WHITELIST));
  const cleanStories = stepOutputs.compile.stories
    .map(item => {
      const metadata = storiesMetadata[item.filePath] || {};
      return {
        ...metadata,
        ...item,
      };
    })
    .map(mapObjectWithWhitelist(STORY_PROPERTY_WHITELIST));

  await writeJson('manifest', DEFAULT_MANIFEST);
  await writeJson('files', cleanFiles);
  await writeJson('stories', cleanStories);

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
