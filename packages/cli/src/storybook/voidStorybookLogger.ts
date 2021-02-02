import { storybookIsInstalled } from './storybookUtils';

export function voidStorybookLogger() {
  if (storybookIsInstalled() && !process.env.DEBUG) {
    // eslint-disable-next-line import/no-extraneous-dependencies
    const { logger } = require('@storybook/node-logger');
    Object.keys(logger).forEach(key => {
      logger[key] = () => {};
    });
  }
}
