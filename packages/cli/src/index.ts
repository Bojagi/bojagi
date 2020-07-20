import './commands/bundle';
import './commands/deploy';
import './commands/upload';
import './commands/runCollectors';
import './commands/list';
import './commands/preview';
import './commands/scan';
import './commands/cleanup';
import './commands/init';
import './commands/docs';

import program = require('commander');

program.parse(process.argv);
