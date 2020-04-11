import './commands/bundle';
import './commands/deploy';
import './commands/upload';
import './commands/runCollectors';
import './commands/list';

import program = require('commander');

program.parse(process.argv);
