import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { JSDOM } from 'jsdom';

export function setupFakeBrowserEnvironment(internalGlobal: any) {
  const componentModules = new Map<string, Record<string, any>>();

  const { window } = new JSDOM('<body></body>');
  // We need to extend global here, so we disable no-param-reassign rule here
  /* eslint-disable no-param-reassign */
  internalGlobal.window = window;
  internalGlobal.React = React;
  internalGlobal.ReactDOM = ReactDOM;
  internalGlobal.document = window.document;
  internalGlobal.registerComponent = (moduleName: string, moduleContent) => {
    componentModules.set(moduleName, moduleContent);
  };
  /* eslint-enable no-param-reassign */

  return componentModules;
}
