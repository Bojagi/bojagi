import { StoryFileWithMetadata } from '../../types';
import { camelCaseToSpaces } from '../../utils/camelCaseToSpaces';

export function getStoriesMetadata(
  stories: StoryFileWithMetadata[],
  componentModules: Map<string, Record<string, any>>
): Record<string, any> {
  return stories.reduce((acc, s) => {
    const module = componentModules.get(s.name);
    const metadata = module
      ? {
          title: (module.default && module.default.title) || camelCaseToSpaces(s.name),
          fileName: s.name,
          storyItems: Object.entries(module)
            .filter(([exportName]) => exportName !== 'default')
            .map(([exportName, storyFn]) => ({
              exportName,
              storyName: storyFn.storyName || camelCaseToSpaces(exportName),
            })),
        }
      : {};
    return {
      ...acc,
      [s.filePath]: metadata,
    };
  }, {});
}
