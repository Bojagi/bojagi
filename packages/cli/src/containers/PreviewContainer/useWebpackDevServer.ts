import * as React from 'react';
import * as pathUtils from 'path';

import { Config } from '../../config';
import { getWebpackConfig } from '../../utils/getWebpackConfig';
import { setupApi } from './setupApi';

import WebpackDevServer = require('webpack-dev-server');
import webpack = require('webpack');

export type UseWebpackDevServerOptions = {
  config: Config;
  componentProps?: any[];
  entrypointsWithMetadata?: Record<string, any>;
};

export type UseWebpackDevServerOutput = {
  devServer?: any;
  ready: boolean;
  established: boolean;
  errors: Error[];
};

export function useWebpackDevServer({
  config,
  entrypointsWithMetadata,
  componentProps,
}: UseWebpackDevServerOptions): UseWebpackDevServerOutput {
  const [devServer, setDevServer] = React.useState<any>();
  const [compiler, setCompiler] = React.useState<webpack.Compiler>();
  const [ready, setReady] = React.useState(false);
  const [errors, setErrors] = React.useState<Error[]>([]);

  const [established, setEstablished] = React.useState(false);

  // Setup dev server
  React.useEffect(() => {
    if (entrypointsWithMetadata && componentProps && !established) {
      getWebpackConfig({
        config,
        storyFiles: [],
      }).then(({ webpackConfig }) => {
        setCompiler(webpack(webpackConfig));
      });
    }
  }, [config, componentProps, entrypointsWithMetadata, established]);

  React.useEffect(() => {
    if (!entrypointsWithMetadata || !componentProps || !compiler) {
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
        before: setupApi({ entrypointsWithMetadata, componentProps, config }),
      });
      setDevServer(server);
      server.listen(config.previewPort);
    }
  }, [compiler, componentProps, entrypointsWithMetadata, established, config]);

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
