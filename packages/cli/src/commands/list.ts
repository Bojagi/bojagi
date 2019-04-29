import { BundleCommandOptions, EntrypointWithMetadata } from './bundle';
import withDefaultArguments from '../utils/withDefaultArguments';
import withHelloGoodbye from '../utils/withHelloGoodbye';
import { emojiMesage } from '../utils/terminalUtils';
import { Spinner } from 'cli-spinner';
import getComponentsOfFolder from '../utils/getComponentsOfFolder';
import getEntrypointsFromComponents from '../utils/getEntrypointsFromComponents';
import renderComponentList from '../renderers/componentList';

export type ListCommandOptions = BundleCommandOptions;

const listAction = async ({ dir }: ListCommandOptions) => {
  emojiMesage('🔎', 'Searching for components');

  const spinner = new Spinner('Searching...');
  spinner.setSpinnerString(18);
  spinner.start();

  const entryFolder = `${process.cwd()}/${dir}`;

  const componentFiles = await getComponentsOfFolder(entryFolder);
  const entrypointsWithMetadata: Record<
    string,
    EntrypointWithMetadata
  > = await getEntrypointsFromComponents(componentFiles);

  spinner.stop(true);

  const fileCount = Object.entries(entrypointsWithMetadata).length;
  if (fileCount === 0) {
    throw new Error('No components found! Have you marked them correctly?');
  }

  renderComponentList(entrypointsWithMetadata, fileCount);
};

const list = program => {
  program
    .command('list')
    .option('-d, --dir [dir]', 'The root folder to search components in')
    .description('lists components that are extracted')
    .action(withHelloGoodbye(withDefaultArguments(listAction)));
};

export default list;
