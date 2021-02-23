#! /bin/bash
set -e

FILE_ROOT=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
PROJECT_ROOT=$FILE_ROOT/..


function preparePackage {
  # we hard copy instead of link as its the only way to secure proper functionality
  rm $PROJECT_ROOT/packages/$1/node_modules/.bin/bojagi || true
  rm -r $PROJECT_ROOT/packages/$1/node_modules/@bojagi/cli || true
  mkdir $PROJECT_ROOT/packages/$1/node_modules/@bojagi || true
  cp -r $PROJECT_ROOT/packages/cli $PROJECT_ROOT/packages/$1/node_modules/@bojagi/
  ln -s $PROJECT_ROOT/packages/$1/node_modules/@bojagi/cli/bin/index.js $PROJECT_ROOT/packages/$1/node_modules/.bin/bojagi
}

function preparePackages {
  preparePackage integration-tests
  installStorybook $1
  preparePackage integration-tests-storybook
}

function integration {
  preparePackages $1
  runIntegration ${@:2}
}

function runIntegration {
    cd $PROJECT_ROOT && yarn jest --runInBand --config integration.jest.config.js --forceExit ${@}
}

function integrationLocal {
  preparePackages
  cd $PROJECT_ROOT && yarn jest --runInBand --config integration.local.jest.config.js --forceExit ${@}
}

function installStorybook {
  lerna add -D --scope @bojagi/integration-tests-storybook @storybook/addon-actions@$1
  lerna add -D --scope @bojagi/integration-tests-storybook @storybook/addon-essentials@$1
  lerna add -D --scope @bojagi/integration-tests-storybook @storybook/addon-links@$1
  lerna add -D --scope @bojagi/integration-tests-storybook @storybook/react@$1
}

case $1 in
  integration )
    integration ${@:2}
    ;;
  integrationLocal )
    integrationLocal ${@:2}
    ;;
esac
