// This file is JS because it supposed to be loaded with webpack (be as vanilla as possible)
import * as path from 'path';

export default getDecorators();

function getDecorators() {
  try {
    return (
      require('storybook-folder/preview.js').decorators ||
      // eslint-disable-next-line no-underscore-dangle
      require('@storybook/react')._decorators ||
      []
    );
  } catch {
    return [];
  }
}
