import * as program from 'commander';
import { bundle, upload, deploy } from './commands';
import baseCmd from './baseCmd';
import list from './commands/list';

// base cmd options
baseCmd(program);

// commands
bundle(program);
upload(program);
deploy(program);
list(program);

program.parse(process.argv);

export * from './pluginUtils';
export * from './types';

