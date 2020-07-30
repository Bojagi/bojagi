import opn from 'opn';

export default function docs(program) {
  program
    .command('docs')
    .description('Open the Bojagi documentation in the browser')
    .action(() => {
      opn('https://bojagi.io/docs');
    });
}
