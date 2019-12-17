export interface BaseOptions {}

const VERSION = '0.0.1';

const baseCmd = program => {
  program
    .version(VERSION)
    .option(
      '-C, --config <path>',
      'sets the config path (defaults to ./.bojagi.conf.json)'
    )
    .option(
      '-R, --root [folder]',
      'root folder to search in (default is "./src")'
    )
    .option(
      '-M, --componentMarker [marker]',
      'marker that to mark a file containing components (default is "@component")'
    );
};

export default baseCmd;
