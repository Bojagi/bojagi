import { SetupApiOptions } from './setupApi';

export function serveStoriesApi({ storiesMetadata, config }: SetupApiOptions) {
  return {
    files: [
      {
        url: `http://localhost:${config.previewPort}/commons.js`,
      },
    ],
    stories: Object.entries(storiesMetadata).map(([filePath, meta]) => ({
      url: `http://localhost:${config.previewPort}/${meta.fileName}.js`,
      stories: meta.stories,
      filePath,
      title: meta.title,
    })),
  };
}
