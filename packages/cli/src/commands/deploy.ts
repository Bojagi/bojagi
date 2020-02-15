import { bundleAction, BundleCommandOptions } from './bundle';
import { uploadAction, UploadCommandOptions } from './upload';
import withDefaultArguments from '../utils/withDefaultArguments';
import withSteps from '../utils/withSteps';
import withHelloGoodbye from '../utils/withHelloGoodbye';
import withDeployValidator from '../validators/withDeployValidator';
import { runCollectorsAction, RunCollectorsCommandOptions } from './runCollectors';

export type DeployCommandOptions = BundleCommandOptions &
  UploadCommandOptions &
  RunCollectorsCommandOptions;

const deployAction = async ({
  componentMarker,
  dir,
  commit,
  steps,
  webpackConfig,
  collectors,
  executionPath,
  decoratorPath,
  storyPath,
}: DeployCommandOptions) => {
  await bundleAction({
    componentMarker,
    dir,
    steps,
    webpackConfig,
    executionPath,
    decoratorPath,
    storyPath,
  });
  await runCollectorsAction({
    executionPath,
    collectors,
    steps,
    storyPath,
    webpackConfig,
  });
  await uploadAction({ commit, steps });
};

const deploy = program => {
  program
    .command('deploy')
    .description('bundles and uploads your marked components to Bojagi')
    .option('-d, --dir [dir]', 'The root folder to search components in')
    .option(
      '--webpack-config [path]',
      'Path to the webpack config file, defaults to webpack.config.js'
    )
    .option('-c, --commit [commit]', 'The commit to upload the components for')
    .action(
      withSteps(5)(withHelloGoodbye(withDefaultArguments(withDeployValidator(deployAction))))
    );
};

export default deploy;
