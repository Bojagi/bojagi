import * as program from 'commander';
import { bundle, upload, deploy, runCollectors, list } from './commands';
import baseCmd from './baseCmd';

// base cmd options
baseCmd(program);

// commands
bundle(program);
upload(program);
deploy(program);
list(program);
runCollectors(program);

program.parse(process.argv);

export * from './types';
