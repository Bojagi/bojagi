/* eslint-disable import/first */
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

const packageJson = require('../package.json');

import program = require('commander');

const MINUMUM_NODE_VERSION = 12;

const [nodeMajorVersion] = process.versions.node.split('.');
if (parseInt(nodeMajorVersion, 10) < MINUMUM_NODE_VERSION) {
  console.error(`\x1b[4m\x1b[31mYou have an outdated node version!`);
  console.error(`\x1b[0m\x1b[33mYour version: ${process.versions.node}`);
  console.error(`Minimum required version: ${MINUMUM_NODE_VERSION}`);
  console.error('Please update your node environment!');
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
