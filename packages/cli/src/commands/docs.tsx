import open = require('open');

export default function docs(program) {
  program
    .command('docs')
    .description('Open the Bojagi documentation in the browser')
    .action(() => {
      open('https://bojagi.io/docs');
    });
}
