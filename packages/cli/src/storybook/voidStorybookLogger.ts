import { storybookIsInstalled } from './storybookUtils';

export function voidStorybookLogger() {
  if (storybookIsInstalled() && !process.env.DEBUG) {
    const { logger } = require('@storybook/node-logger');
    Object.keys(logger).forEach(key => {
      logger[key] = () => {};
    });
  }
}
