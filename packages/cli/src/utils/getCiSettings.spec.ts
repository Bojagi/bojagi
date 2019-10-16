import getCiSettingsFactory from './getCiSettings';

test('get CircleCI environment settings', () =>
  testCiConfig({
    CI: 'true',
    CIRCLECI: 'true',
    CIRCLE_SHA1: 'git-hash'
  }));

test('get Travis CI environment settings', () =>
  testCiConfig({
    CI: 'true',
    TRAVIS: 'true',
    TRAVIS_COMMIT: 'git-hash'
  }));

test('get GitLab CI environment settings', () =>
  testCiConfig({
    CI: 'true',
    GITLAB_CI: 'true',
    CI_COMMIT_SHA: 'git-hash'
  }));

test('get GitHub Actions environment settings', () =>
  testCiConfig({
    GITHUB_ACTION: 'something',
    GITHUB_REPOSITORY: 'bojagi/bojagi',
    GITHUB_SHA: 'git-hash'
  }));

test('get Jenkins environment settings', () =>
  testCiConfig({
    JENKINS_URL: 'https://some.thing',
    GIT_COMMIT: 'git-hash'
  }));

test('get TeamCity environment settings', () =>
  testCiConfig({
    TEAMCITY_VERSION: '1.0',
    GIT_HASH: 'git-hash'
  }));

test('get Unknown CI environment settings', () => {
  const settings = getCiSettingsFactory({
    CI: 'true'
  })();
  expect(settings).toEqual({
    ci: true
  });
});

test('get "No CI" environment settings', () => {
  const settings = getCiSettingsFactory({})();
  expect(settings).toEqual({
    ci: false
  });
});

function testCiConfig(env) {
  const settings = getCiSettingsFactory(env)();
  expect(settings).toEqual({
    ci: true,
    commit: 'git-hash'
  });
}
