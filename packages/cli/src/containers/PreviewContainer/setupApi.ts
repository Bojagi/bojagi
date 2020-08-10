import * as express from 'express';
import { Config } from '../../config';
import { PREVIEW_CLIENT_OUTPUT_FOLDER } from '../../constants';
import { serveStoriesApi } from './serveStoryApi';
import { StoryCollectionMetadata } from '../../steps/analyze';

import history = require('connect-history-api-fallback');

export type SetupApiOptions = {
  storiesMetadata: Record<string, StoryCollectionMetadata>;
  config: Config;
};

export function setupApi(options: SetupApiOptions) {
  return (app: express.Application) => {
    app.get('/api/stories', (_req, res) => {
      res.json(serveStoriesApi(options));
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
