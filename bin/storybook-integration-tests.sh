#! /bin/bash
set -e

FILE_ROOT=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
PROJECT_ROOT=$FILE_ROOT/..

# git clone --depth 1 git@github.com:storybookjs/storybook.git $PROJECT_ROOT/foreignIntegrationTests/storybook || true

# yarn link --cwd $PROJECT_ROOT/packages/cli 

function runForPackage {
  # setup
  # cp -r $PROJECT_ROOT/foreignIntegrationTests/storybook/examples/$1 $PROJECT_ROOT/foreignIntegrationTests/ || true
  # $FILE_ROOT/prepareExamplePackage.sh $1
  # yarn install --pure-lockfile --cwd $PROJECT_ROOT/foreignIntegrationTests/$1 
  # yarn link --cwd $PROJECT_ROOT/foreignIntegrationTests/$1 @bojagi/cli 
  # ln -sf $PROJECT_ROOT/foreignIntegrationTests/$1/node_modules/@bojagi/cli/bin/index.js $PROJECT_ROOT/foreignIntegrationTests/$1/node_modules/.bin/bojagi 

  # run test
  cd $PROJECT_ROOT/foreignIntegrationTests/$1 

  # startup preview server
  CI=true yarn bojagi preview --noOpen &
  PREVIEW_PID=$!
  set +e
  while true; do 
    if [[ $(curl -s "http://localhost:5002/api/stories" -I | head -n 1|cut -d$' ' -f2) == "200" ]]; then 
      break
    fi
    sleep 1
  done
  set -e
  echo "up and running"

  # close server again
  kill $PREVIEW_PID 
}

# all integration test packages
runForPackage cra-kitchen-sink
# preparePackage cra-ts-essentials
# preparePackage react-ts


## get stories from preview
# http://localhost:5002/api/stories