#! /bin/bash
set -e

git checkout master
git fetch -p
git pull -r

# experimental, run local snapshot tests before deploying
yarn --pure-lockfile
lerna bootstrap -- --pure-lockfile
yarn build
yarn integrationLocal
# end experimental
yarn updateReadmes

lerna version