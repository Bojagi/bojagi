import * as React from 'react';
import { render } from 'ink';
import { PreviewContainer } from '../containers/PreviewContainer';
import { ConfigProvider } from '../config/configContext';

export default function preview(program) {
  program
    .command('preview')
    .option('--storyPath [pathPattern]', 'path pattern to search for stories in')
    .option('--webpackConfig [path]', 'Path to the webpack config file')
    .option('--port [port]', 'Port that the preview server is going to be available in')
    .description('starts a local preview server')
    .action(({ webpackConfig, storyPath, port }) => {
      render(
        <ConfigProvider config={{ webpackConfig, storyPath, dryRun: true, previewPort: port }}>
          <PreviewContainer />
        </ConfigProvider>
      );
    });
}
