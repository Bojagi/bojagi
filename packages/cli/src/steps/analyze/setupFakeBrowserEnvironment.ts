import * as React from 'react';
import * as ReactDOM from 'react-dom';

const jsDomGlobal = require('jsdom-global');

export function setupFakeBrowserEnvironment(internalGlobal: any) {
  const componentModules = new Map<string, Record<string, any>>();
  const cleanup = jsDomGlobal();
  require('matchmedia-polyfill');
  require('matchmedia-polyfill/matchMedia.addListener');

  // We need to extend global here, so we disable no-param-reassign rule here
  /* eslint-disable no-param-reassign */
  internalGlobal.react = React;
  internalGlobal.reactDom = ReactDOM;
  internalGlobal.registerComponent = (moduleName: string, moduleContent) => {
    componentModules.set(moduleName, moduleContent);
  };
  /* eslint-enable no-param-reassign */

  return { componentModules, cleanup };
}
