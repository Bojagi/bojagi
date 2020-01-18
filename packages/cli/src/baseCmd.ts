const pack = require('../package.json');

export interface BaseOptions {}

const baseCmd = program => {
  program
    .version(pack.version)
    .option('-C, --config <path>', 'sets the config path (defaults to ./.bojagi.conf.json)')
    .option('-R, --root [folder]', 'root folder to search in (default is "./src")')
    .option(
      '-M, --componentMarker [marker]',
      'marker that to mark a file containing components (default is "@component")'
    );
};

export default baseCmd;
