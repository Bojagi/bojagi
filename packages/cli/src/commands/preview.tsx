import * as React from 'react';
import { render } from 'ink';
import { PreviewContainer } from '../containers/PreviewContainer';
import { ConfigProvider } from '../config/configContext';

export default function preview(program) {
  program
    .command('preview')
    .option('--storyPath [pathPattern]', 'path pattern to search for stories in')
    .option('-s, --staticDir [paths]', 'path(s) to copy static files from')
    .option('--webpackConfig [path]', 'Path to the webpack config file')
    .option('--port [port]', 'Port that the preview server is going to be available in')
    .option('--noOpen', 'If set does not automatically open browser')
    .description('starts a local preview server')
    .action(({ webpackConfig, storyPath, port, noOpen, staticDir }) => {
      render(
        <ConfigProvider
          config={{
            webpackConfig,
            storyPath,
            staticDir,
            dryRun: true,
            previewPort: port,
            previewNoOpen: noOpen,
          }}
        >
          <PreviewContainer />
        </ConfigProvider>
      );
    });
}
