import { serveStoriesApi } from './serveStoryApi';

test('get components API output', () => {
  const getFiles = jest.fn(() => [
    {
      name: 'file1Output.js',
      url: 'http://localhost:5000/file1Output.js',
    },
    {
      name: 'file2Output.js',
      url: 'http://localhost:5000/file2Output.js',
    },
    {
      name: 'file2Output.css',
      url: 'http://localhost:5000/file2Output.css',
    },
  ]);
  const getAssets = jest.fn(() => ({
    file1: ['file1Output.js'],
    file2: ['file2Output.css', 'file2Output.js'],
  }));
  const config: any = {
    previewPort: 1234,
    executionPath: '/some/path',
  };

  const storiesMetadata = {
    file2: {
      fileName: 'file2',
      title: 'FILE TWO',
      filePath: '/some/path/some/feli.ts',
      storyItems: [
        {
          exportName: 'story3',
          storyName: 'story drei',
        },
      ],
    },
    file1: {
      fileName: 'file1',
      title: 'FILE ONE',
      filePath: '/some/path/some/file.ts',
      storyItems: [
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
    emptyFile: {
      fileName: 'empty',
      title: 'FILE EMPTY',
      filePath: '/some/path/some/empty_file.ts',
      storyItems: [],
    },
  };

  const result = serveStoriesApi({
    storiesMetadata,
    config,
    getFiles,
    getAssets,
  } as any);

  expect(result).toEqual({
    files: [
      {
        name: 'file1Output.js',
        url: 'http://localhost:5000/file1Output.js',
      },
      {
        name: 'file2Output.js',
        url: 'http://localhost:5000/file2Output.js',
      },
      {
        name: 'file2Output.css',
        url: 'http://localhost:5000/file2Output.css',
      },
    ],
    stories: [
      {
        filePath: 'file1',
        title: 'FILE ONE',
        files: ['file1Output.js'],
        storyItems: [
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
        filePath: 'file2',
        title: 'FILE TWO',
        files: ['file2Output.css', 'file2Output.js'],
        storyItems: [
          {
            exportName: 'story3',
            storyName: 'story drei',
          },
        ],
      },
    ],
  });
});
