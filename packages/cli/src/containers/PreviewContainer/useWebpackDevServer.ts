import * as React from 'react';
import * as pathUtils from 'path';

import { Config } from '../../config';
import { getWebpackConfig } from '../../utils/getWebpackConfig';
import { setupApi } from './setupApi';
import { StoryCollectionMetadata } from '../../steps/analyze';
import { StoryWithMetadata } from '../../types';

import WebpackDevServer = require('webpack-dev-server');
import webpack = require('webpack');

export type UseWebpackDevServerOptions = {
  config: Config;
  storyFiles?: StoryWithMetadata[];
  storiesMetadata?: Record<string, StoryCollectionMetadata>;
};

export type UseWebpackDevServerOutput = {
  devServer?: any;
  ready: boolean;
  established: boolean;
  errors: Error[];
};

export function useWebpackDevServer({
  config,
  storiesMetadata,
  storyFiles,
}: UseWebpackDevServerOptions): UseWebpackDevServerOutput {
  const [devServer, setDevServer] = React.useState<any>();
  const [compiler, setCompiler] = React.useState<webpack.Compiler>();
  const [ready, setReady] = React.useState(false);
  const [errors, setErrors] = React.useState<Error[]>([]);

  const [established, setEstablished] = React.useState(false);

  // Setup dev server
  React.useEffect(() => {
    if (storyFiles && storiesMetadata && !established) {
      getWebpackConfig({
        config,
        storyFiles,
      }).then(({ webpackConfig }) => {
        setCompiler(webpack(webpackConfig));
      });
    }
  }, [config, storiesMetadata, storyFiles, established]);

  React.useEffect(() => {
    if (!storiesMetadata || !compiler) {
      return;
    }

    if (!established) {
      compiler.hooks.beforeCompile.tap('BojagiPreview', () => {
        setReady(false);
        setErrors([]);
      });

      compiler.hooks.done.tap('BojagiPreview', compileOutput => {
        setEstablished(true);
        setErrors(compileOutput.compilation.errors);
        setReady(true);
      });

      const server = new WebpackDevServer(compiler as any, {
        noInfo: true,
        stats: 'none',
        liveReload: false,
        hot: false,
        open: true,
        contentBase: pathUtils.join(__dirname, 'public'),
        before: setupApi({ storiesMetadata, config }),
      });
      setDevServer(server);
      server.listen(config.previewPort);
    }
  }, [compiler, storiesMetadata, established, config]);

  // Close dev server on unmount
  React.useEffect(() => {
    if (devServer) {
      return () => {
        devServer.close();
      };
    }

    return () => {};
  }, [devServer]);

  return React.useMemo(() => ({ devServer, ready, established, errors }), [
    devServer,
    ready,
    established,
    errors,
  ]);
}
