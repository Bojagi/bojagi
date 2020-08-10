import { serveStoriesApi } from './serveStoryApi';

test('get components API output', () => {
  const config: any = {
    previewPort: 1234,
    executionPath: '/some/path',
  };

  const storiesMetadata = {
    file1: {
      fileName: 'file1',
      title: 'FILE ONE',
      filePath: '/some/path/some/file.ts',
      stories: [
        {
          exportName: 'story1',
          storyName: 'story eins',
        },
        {
          exportName: 'story2',
          storyName: 'story zwei',
        },
      ],
    },
    file2: {
      fileName: 'file2',
      title: 'FILE TWO',
      filePath: '/some/path/some/feli.ts',
      stories: [
        {
          exportName: 'story3',
          storyName: 'story drei',
        },
      ],
    },
  };

  const result = serveStoriesApi({
    storiesMetadata,
    config,
  });

  expect(result).toEqual({
    files: [
      {
        url: 'http://localhost:1234/commons.js',
      },
    ],
    stories: [
      {
        url: `http://localhost:1234/file1.js`,
        filePath: 'file1',
        title: 'FILE ONE',
        stories: [
          {
            exportName: 'story1',
            storyName: 'story eins',
          },
          {
            exportName: 'story2',
            storyName: 'story zwei',
          },
        ],
      },
      {
        url: `http://localhost:1234/file2.js`,
        filePath: 'file2',
        title: 'FILE TWO',
        stories: [
          {
            exportName: 'story3',
            storyName: 'story drei',
          },
        ],
      },
    ],
  });
});
