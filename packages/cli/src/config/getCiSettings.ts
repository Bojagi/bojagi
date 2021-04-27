import { ProvisionalConfig } from './types';

type EnvObject = Record<string, string>;

type DetectionFn = (env: EnvObject) => boolean;

export type CiSettings = {
  commit?: string;
  ci: boolean;
};

export type CiEnvironment = {
  name: string;
  readableName: string;
  check: DetectionFn;
  getSettings: (env: EnvObject, provisionalConfig: ProvisionalConfig) => CiSettings;
};

const FALLBACK_CI: CiEnvironment = {
  name: 'no_ci',
  readableName: 'No CI',
  check: env => !env.CI,
  getSettings: () => ({
    ci: false,
  }),
};

const CI_ENVIRONMENTS: CiEnvironment[] = [
  {
    name: 'circle_ci',
    readableName: 'CircleCI',
    check: env => !!env.CI && !!env.CIRCLECI,
    getSettings: env => ({
      commit: env.CIRCLE_SHA1,
      ci: true,
    }),
  },
  {
    name: 'travis_ci',
    readableName: 'Travis CI',
    check: env => !!env.CI && !!env.TRAVIS,
    getSettings: env => ({
      commit: env.TRAVIS_COMMIT,
      ci: true,
    }),
  },
  {
    name: 'gitlab_ci',
    readableName: 'GitLab CI',
    check: env => !!env.CI && !!env.GITLAB_CI,
    getSettings: env => ({
      commit: env.CI_COMMIT_SHA,
      ci: true,
    }),
  },
  {
    name: 'github_actions',
    readableName: 'GitHub Actions',
    check: env => !!env.GITHUB_ACTION && !!env.GITHUB_REPOSITORY,
    getSettings: (env, provisionalConfig) => ({
      commit: provisionalConfig.commit || env.GITHUB_SHA,
      ci: true,
    }),
  },
  {
    name: 'jenkins',
    readableName: 'Jenkins',
    check: env => !!env.JENKINS_URL,
    getSettings: env => ({
      commit: env.GIT_COMMIT,
      ci: true,
    }),
  },
  {
    name: 'teamcity',
    readableName: 'TeamCity',
    check: env => !!env.TEAMCITY_VERSION && !!env.GIT_HASH,
    getSettings: env => ({
      commit: env.GIT_HASH,
      ci: true,
    }),
  },
  {
    name: 'unknown_ci',
    readableName: 'Unknown CI',
    check: env => !!env.CI,
    getSettings: () => ({
      ci: true,
    }),
  },
];

export default function getCiSettingsFactory(env) {
  return (tempConfig: ProvisionalConfig) => {
    const environment: CiEnvironment =
      CI_ENVIRONMENTS.find(({ check }) => check(env)) || FALLBACK_CI;
    return environment.getSettings(env, tempConfig);
  };
}
