#! /bin/bash
set -e

FILE_ROOT=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
PROJECT_ROOT=$FILE_ROOT/..

git clone --depth 1 git@github.com:storybookjs/storybook.git $PROJECT_ROOT/foreignIntegrationTests/storybook || true

yarn link --cwd $PROJECT_ROOT/packages/cli 

function runForPackage {
  # setup
  cp -r $PROJECT_ROOT/foreignIntegrationTests/storybook/examples/$1 $PROJECT_ROOT/foreignIntegrationTests/ || true
  $FILE_ROOT/prepareExamplePackage.sh $1
  yarn install --pure-lockfile --cwd $PROJECT_ROOT/foreignIntegrationTests/$1 
  yarn link --cwd $PROJECT_ROOT/foreignIntegrationTests/$1 @bojagi/cli 
  ln -sf $PROJECT_ROOT/foreignIntegrationTests/$1/node_modules/@bojagi/cli/bin/index.js $PROJECT_ROOT/foreignIntegrationTests/$1/node_modules/.bin/bojagi 

  # run test
  cd $PROJECT_ROOT/foreignIntegrationTests/$1 && yarn bojagi preview --noOpen
}

# all integration test packages
runForPackage cra-kitchen-sink
# preparePackage cra-ts-essentials
# preparePackage react-ts


## get stories from preview
# http://localhost:5002/api/stories