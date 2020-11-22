import axios from 'axios';
import { StepRunnerStep, StepRunnerActionOptions } from '../../containers/StepRunner';
import { Config } from '../../config';
import { handleApiError } from '../../apiErrorHandling';

export type CreateStoriesStepOutput = {
  uploadUrl: string;
};

export const createStoriesStep: StepRunnerStep<CreateStoriesStepOutput> = {
  action,
  emoji: 'seedling',
  name: 'createStories',
  messages: {
    running: () => 'Creating stories on Bojagi',
    success: () => 'Stories created on Bojagi',
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

  try {
    const result = await createStoriesApiCall(config, apiSecret);
    return {
      uploadUrl: result.data.data.uploadCreate.uploadUrl,
    };
  } catch (err) {
    handleApiError(err);
    // Rethrow
    throw err;
  }
}

async function createStoriesApiCall({ commit, uploadApiUrl }: Config, apiSecret: string) {
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
