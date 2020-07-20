import opn from 'opn';

import program = require('commander');

program
  .command('docs')
  .description('Open the Bojagi documentation in the browser')
  .action(() => {
    opn('https://bojagi.io/docs');
  });
