const getEntrypointsFromComponents = components =>
  components.reduce((eps, component) => {
    const entrypointName = component.filePath.match(/.+\/([^\/]+)\..+?$/)[1];
    return {
      ...eps,
      [entrypointName]: {
        ...component,
        entrypoint: `component-extract-loader?${entrypointName}!${component.filePath}`
      }
    };
  }, {});

export default getEntrypointsFromComponents;
