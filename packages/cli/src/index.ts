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

import program = require('commander');

bundle(program);
deploy(program);
upload(program);
preview(program);
scan(program);
cleanup(program);
init(program);
docs(program);

program.parse(process.argv);
