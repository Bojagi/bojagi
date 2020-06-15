import * as React from 'react';
import { render } from 'ink';
import { PreviewContainer } from '../containers/PreviewContainer';
import { ConfigProvider } from '../config/configContext';

import program = require('commander');

program
  .command('preview')
  .option('-d, --dir [dir]', 'The root folder to search components in')
  .option(
    '--webpack-config [path]',
    'Path to the webpack config file, defaults to webpack.config.js'
  )
  .option('--port [port]', 'Port that the preview server is going to be available in')
  .description('starts a local preview server')
  .action(({ port }) => {
    render(
      <ConfigProvider config={{ dryRun: true, previewPort: port }}>
        <PreviewContainer />
      </ConfigProvider>
    );
  });
