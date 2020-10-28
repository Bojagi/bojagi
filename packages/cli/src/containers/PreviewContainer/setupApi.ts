import * as express from 'express';
import { Config } from '../../config';
import { PREVIEW_CLIENT_OUTPUT_FOLDER } from '../../constants';
import { serveStoriesApi } from './serveStoryApi';
import { StoryCollectionMetadata } from '../../steps/analyze';

import history = require('connect-history-api-fallback');

export type SetupApiOptions = {
  storiesMetadata: Record<string, StoryCollectionMetadata>;
  getFiles: () => any[];
  getAssets: () => Record<string, string[]>;
  config: Config;
};

export function setupApi(options: SetupApiOptions) {
  return (app: express.Application) => {
    app.get('/api/stories', (_req, res, next) => {
      try {
        res.json(serveStoriesApi(options));
      } catch (e) {
        next(e);
      }
    });
    app.use((err, _req, res, _next) => {
      res.status(err.status || 500);
      res.json({
        message: err.message,
        error: err,
        stack: err.stack,
      });
    });
    handleStaticServer(app);
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
