// This file is JS because it supposed to be loaded with webpack (be as vanilla as possible)
import * as path from 'path';

export default getParameters();

function getParameters() {
  try {
    const preview = require('storybook-folder/preview.js');
    return preview.parameters || {};
  } catch {
    return {};
  }
}

function extractGlobals(preview) {
  if (preview.globalTypes) {
    return Object.entries(preview.globalTypes).reduce(
      (acc, [key, def]) => ({
        ...acc,
        [key]: def.defaultValue,
      }),
      {}
    );
  }

  return {};
}
