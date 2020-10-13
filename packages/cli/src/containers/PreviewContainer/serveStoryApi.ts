import { SetupApiOptions } from './setupApi';

export function serveStoriesApi({ storiesMetadata, getFiles, getAssets }: SetupApiOptions) {
  const assets = getAssets();

  return {
    files: getFiles(),
    stories: Object.entries(storiesMetadata).map(([filePath, meta]) => {
      return {
        files: assets[meta.fileName],
        storyItems: meta.storyItems,
        filePath,
        title: meta.title,
      };
    }),
  };
}
