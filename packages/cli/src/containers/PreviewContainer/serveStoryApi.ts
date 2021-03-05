import { StoryCollectionMetadata } from '../../steps/analyze';
import { filterEmptyStories } from '../../utils/filterEmptyStories';
import { SetupApiOptions } from './setupApi';

export function serveStoriesApi({ storiesMetadata, getFiles, getAssets }: SetupApiOptions) {
  const assets = getAssets();

  return {
    files: getFiles().map(({ url, name }) => ({ name, url })),
    stories: Object.entries(storiesMetadata)
      .filter(([, meta]) => filterEmptyStories(meta))
      .sort(sortStory)
      .map(([filePath, meta]) => {
        return {
          files: assets[meta.fileName],
          storyItems: meta.storyItems,
          filePath,
          title: meta.title,
        };
      }),
  };
}

function sortStory(a: [string, StoryCollectionMetadata], b: [string, StoryCollectionMetadata]) {
  if (a[1].title < b[1].title) {
    return -1;
  }

  if (a[1].title > b[1].title) {
    return 1;
  }

  return 0;
}
