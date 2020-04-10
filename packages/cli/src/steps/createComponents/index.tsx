import axios from 'axios';
import { StepRunnerStep, StepRunnerActionOptions } from '../../containers/StepRunner';
import { Config } from '../../config';

export type CreateComponentsStepOutput = {
  uploadUrl: string;
};

export const createComponentsStep: StepRunnerStep<CreateComponentsStepOutput> = {
  action,
  emoji: 'seedling',
  name: 'createComponents',
  messages: {
    running: () => 'Creating components on Bojagi',
    success: () => 'Components created on Bojagi',
    error: ({ error }) => {
      const isAuthorizationError =
        error &&
        (error as any).response.data.errors &&
        (error as any).response.data.errors[0].extensions.code === 'UNAUTHENTICATED';

      return isAuthorizationError
        ? 'You are not authorized'
        : 'Failed creating components on Bojagi';
    },
  },
};

async function action({ config }: StepRunnerActionOptions) {
  const apiSecret = process.env.BOJAGI_SECRET as string;

  const result = await createComponentsApiCall(config, apiSecret);

  return {
    uploadUrl: result.data.data.uploadCreate.uploadUrl,
  };
}

async function createComponentsApiCall({ commit, uploadApiUrl }: Config, apiSecret: string) {
  const query = `
	  mutation CreateUpload($commit: String!) {
      uploadCreate(commitId: $commit) {
        id
        uploadUrl
      }
    }
  `;

  const variables = { commit };

  return axios.post(
    `${uploadApiUrl}/graphql`,
    {
      query,
      variables,
    },
    {
      headers: {
        'Content-type': 'application/json',
        authorization: `Secret ${apiSecret}`,
      },
    }
  );
}
