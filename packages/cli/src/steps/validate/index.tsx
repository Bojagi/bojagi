/* eslint-disable max-classes-per-file */
import * as React from 'react';
import axios from 'axios';
import { Color } from 'ink';
import { StepRunnerStep, StepRunnerActionOptions } from '../../containers/StepRunner';
import { MANIFEST_VERSION } from '../../constants';
import { Emoji } from '../../components/Emoji';
import debuggers, { DebugNamespaces } from '../../debug';

const debug = debuggers[DebugNamespaces.VALIDATE];

class UnknownVersionError extends Error {}
class InactiveVersionError extends Error {}

type ManifestVersionApiResponse = {
  data: {
    manifestVersion: ManifestVersion;
  };
};

export enum VersionStatuses {
  ACTIVE = 'ACTIVE',
  DEPRECATED = 'DEPRECATED',
  INACTIVE = 'INACTIVE',
}

export type ManifestVersion = {
  version: string;
  status: VersionStatuses;
  supportEnd?: string;
  deprecationMessage?: string;
};

export type ValidateStepOutput = {
  manifestVersion: ManifestVersion;
};

export const validateStep: StepRunnerStep<ValidateStepOutput> = {
  action,
  emoji: 'male-detective' as any,
  name: 'validate',
  messages: {
    running: () => 'Checking if version is up-to-date',
    success: SuccessResponse,
    error: () => 'Failed checking version',
  },
};

async function action({ config }: StepRunnerActionOptions): Promise<ValidateStepOutput> {
  const apiSecret = process.env.BOJAGI_SECRET as string;
  const query = `
	  query GetVesion($version: String!) {
      manifestVersion(version: $version) {
        version
        status
        supportEnd
        deprecationMessage
      }
    }
  `;

  const variables = {
    version: MANIFEST_VERSION,
  };

  try {
    const result = await axios.post<ManifestVersionApiResponse>(
      `${config.uploadApiUrl}/graphql`,
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

    const { manifestVersion } = result.data.data;
    debug('manifestVersion', manifestVersion);

    if (!manifestVersion) {
      throw new UnknownVersionError('Manifest version not known, are you from the future?');
    }

    if (manifestVersion.status === VersionStatuses.INACTIVE) {
      throw new InactiveVersionError(
        'Your manifest version is inactive. Please update to the newest bojagi CLI version!'
      );
    }

    return {
      manifestVersion,
    };
  } catch (err) {
    debug('Error', err.response.data);
    throw err;
  }
}

function SuccessResponse({
  manifestVersion: { status, deprecationMessage, supportEnd },
}: ValidateStepOutput) {
  if (status === VersionStatuses.ACTIVE) {
    return 'Your version is up-to-date';
  }
  if (status === VersionStatuses.DEPRECATED) {
    return (
      <>
        <Emoji code="warning" /> <Color yellow>{deprecationMessage}</Color> (support ends{' '}
        {supportEnd})
      </>
    );
  }
}
