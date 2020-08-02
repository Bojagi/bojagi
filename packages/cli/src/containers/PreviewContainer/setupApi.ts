import * as express from 'express';
import { Config } from '../../config';
import { PREVIEW_CLIENT_OUTPUT_FOLDER } from '../../constants';
import { serveComponentsApi } from './serveComponentsApi';

import history = require('connect-history-api-fallback');

export type SetupApiOptions = {
  entrypointsWithMetadata: Record<string, any>;
  componentProps: any[];
  config: Config;
};

export function setupApi(options: SetupApiOptions) {
  return (app: express.Application) => {
    handleStaticServer(app);
    app.get('/api/components', (_req, res) => {
      res.json(serveComponentsApi(options));
    });
  };
}

function handleStaticServer(app: express.Application) {
  // History API fallback for SPA
  app.use(
    history({
      index: '/app/index.html',
    })
  );
  // Server client files
  app.use(
    '/app',
    express.static(PREVIEW_CLIENT_OUTPUT_FOLDER, {
      redirect: false,
    })
  );
}
