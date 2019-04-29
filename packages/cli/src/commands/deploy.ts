import { bundleAction, BundleCommandOptions } from './bundle';
import { uploadAction, UploadCommandOptions } from './upload';
import withDefaultArguments from '../utils/withDefaultArguments';
import withSteps from '../utils/withSteps';
import withHelloGoodbye from '../utils/withHelloGoodbye';
import withDeployValidator from '../validators/withDeployValidator';

export type DeployCommandOptions = BundleCommandOptions & UploadCommandOptions;

const deployAction = async ({
  marker,
  markerPrefix,
  dir,
  commit,
  steps
}: DeployCommandOptions) => {
  await bundleAction({ marker, markerPrefix, dir, steps });
  await uploadAction({ commit, steps });
};

const deploy = program => {
  program
    .command('deploy')
    .description('bundles and uploads your marked components to Bojagi')
    .option('-d, --dir [dir]', 'The root folder to search components in')
    .option('-c, --commit [commit]', 'The commit to upload the components for')
    .action(
      withSteps(4)(
        withHelloGoodbye(
          withDefaultArguments(withDeployValidator(deployAction))
        )
      )
    );
};

export default deploy;
