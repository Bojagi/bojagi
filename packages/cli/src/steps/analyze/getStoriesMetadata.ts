import { StoryFileWithMetadata, OutputFileContent } from '../../types';

export function getStoriesMetadata(
  stories: OutputFileContent<StoryFileWithMetadata>[],
  componentModules: Map<string, Record<string, any>>
): Record<string, any> {
  return stories.reduce((acc, { fileContent, outputFilePath, ...s }) => {
    const module = componentModules.get(s.fileName);
    const metadata = module
      ? {
          title: (module.default && module.default.title) || s.name,
          fileName: s.fileName,
          stories: Object.entries(module)
            .filter(([exportName]) => exportName !== 'default')
            .map(([exportName, storyFn]) => ({
              exportName,
              storyName: storyFn.storyName || exportName,
            })),
        }
      : {};
    return {
      ...acc,
      [s.filePath]: metadata,
    };
  }, {});
}
