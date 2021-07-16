import * as React from 'react';
import * as ReactDOM from 'react-dom';
import debuggers, { DebugNamespaces } from '../../debug';

const debug = debuggers[DebugNamespaces.ANALYZE];

const jsDomGlobal = require('jsdom-global');

export function setupFakeBrowserEnvironment(internalGlobal: any) {
  const componentModules = new Map<string, Record<string, any>>();
  // url is needed for local storage to work
  // for full options see
  // https://github.com/jsdom/jsdom#customizing-jsdom
  const cleanup = jsDomGlobal(``, {
    url: 'http://localhost:5002',
  });
  require('matchmedia-polyfill');
  require('matchmedia-polyfill/matchMedia.addListener');

  // We need to extend global here, so we disable no-param-reassign rule here
  /* eslint-disable no-param-reassign */
  internalGlobal.react = React;
  internalGlobal.reactDom = ReactDOM;
  internalGlobal.registerComponent = (moduleName: string, moduleContent) => {
    debug('register component %s', moduleName);
    componentModules.set(moduleName, moduleContent);
  };
  /* eslint-enable no-param-reassign */

  return { componentModules, cleanup };
}
