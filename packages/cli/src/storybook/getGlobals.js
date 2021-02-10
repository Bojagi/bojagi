// This file is JS because it supposed to be loaded with webpack (be as vanilla as possible)
import * as path from 'path';

export default getGlobals();

function getGlobals() {
  try {
    const preview = require('storybook-folder/preview.js');
    return extractGlobals(preview);
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
