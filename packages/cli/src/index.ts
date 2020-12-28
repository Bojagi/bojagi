/* eslint-disable import/first */
import * as React from 'react';
import setEnv from './setEnv';

setEnv(); // set before the rest is loaded

import bundle from './commands/bundle';
import deploy from './commands/deploy';
import upload from './commands/upload';
import preview from './commands/preview';
import scan from './commands/scan';
import cleanup from './commands/cleanup';
import init from './commands/init';
import docs from './commands/docs';
import { MINIMUM_NODE_VERSION, MINIMUM_REACT_VERSION } from './constants';

const packageJson = require('../package.json');

import program = require('commander');

const COLOR_RED = '\x1b[31m';
const COLOR_YELLOW = '\x1b[33m';
const FORMAT_UNDERLINE = '\x1b[4m';
const FORMAT_RESET = '\x1b[0m';

const [nodeMajorVersion] = process.versions.node.split('.');
if (parseInt(nodeMajorVersion, 10) < MINIMUM_NODE_VERSION) {
  console.error(`${FORMAT_UNDERLINE}${COLOR_RED}You have an outdated node version!${FORMAT_RESET}`);
  console.error(`${COLOR_YELLOW}Your version: ${process.versions.node}`);
  console.error(`Minimum required version: ${MINIMUM_NODE_VERSION}`);
  console.error('Please update your node environment!');
  process.exit(1);
}

const [reactMajorVersion, reactMinorVersion] = React.version
  .split('.')
  .map(segment => Number(segment));
const [minimumReactMajorVersion, minimumReactMinorVersion] = MINIMUM_REACT_VERSION.split(
  '.'
).map(segment => Number(segment));
if (
  reactMajorVersion < minimumReactMajorVersion ||
  (reactMajorVersion === minimumReactMajorVersion && reactMinorVersion < minimumReactMinorVersion)
) {
  console.error(
    `${FORMAT_UNDERLINE}${COLOR_RED}You have an outdated react version!${FORMAT_RESET}`
  );
  console.error(`${COLOR_YELLOW}Your version: ${React.version}`);
  console.error(`Minimum required version: ${MINIMUM_REACT_VERSION}`);
  console.error('Please update React!');
  process.exit(1);
}

program.version(packageJson.version);

bundle(program);
deploy(program);
upload(program);
preview(program);
scan(program);
cleanup(program);
init(program);
docs(program);

program.on('command:*', operands => {
  console.error(`Error: unknown command '${operands[0]}'\n`);
  process.exitCode = 1;
  program.help();
});

program.parse(process.argv);

if (process.argv.length < 3) {
  program.help();
}
