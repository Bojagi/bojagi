import setEnv from './setEnv';
import bundle from './commands/bundle';
import deploy from './commands/deploy';
import upload from './commands/upload';
import runCollectors from './commands/runCollectors';
import list from './commands/list';
import preview from './commands/preview';
import scan from './commands/scan';
import cleanup from './commands/cleanup';
import init from './commands/init';
import docs from './commands/docs';

import program = require('commander');

setEnv();

bundle(program);
deploy(program);
upload(program);
runCollectors(program);
list(program);
preview(program);
scan(program);
cleanup(program);
init(program);
docs(program);

program.parse(process.argv);
