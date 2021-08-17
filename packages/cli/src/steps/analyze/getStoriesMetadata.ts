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
          parameters: getFileParameters(module),
          storyItems: Object.entries(module)
            .filter(([exportName]) => exportName !== 'default')
            .map(([exportName, storyFn]) => ({
              exportName,
              // TODO: put back in when parameters are exposed to API
              // parameters: getStoryParameters(storyFn.parameters),
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

function getFileParameters(module: Record<string, any>) {
  const params = module.default?.parameters ?? {};
  // eslint-disable-next-line no-undef
  const globalParams = (global as any).bojagiSbParameters?.default || {};

  return {
    layout: params.layout ?? globalParams.layout,
    figmaUrl: getFigmaUrl(params),
  };
}

// TODO: put back in when parameters are exposed to API
// function getStoryParameters(storyParameters: Record<string, any> = {}) {
//   return {
//     layout: storyParameters.layout,
//     figmaUrl: getFigmaUrl(storyParameters),
//   };
// }

function getFigmaUrl(params: Record<string, any>) {
  const designParams = params.design ?? {};
  return designParams.type === 'figma' ? designParams.url : undefined;
}
