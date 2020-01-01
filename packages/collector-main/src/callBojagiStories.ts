import * as ReactTestRenderer from 'react-test-renderer';
import { JSDOM } from 'jsdom';
import { setPropSetName } from './propSetNameContext';
import { getOutputPath } from './pathFactories';

export const callBojagiStories = callBojagiStoriesFactory(require);

export function callBojagiStoriesFactory(internalRequire: NodeRequire) {
  return (executionPath: string, entry: Record<string, string>) => {
    const { window, document } = new JSDOM('<body></body>');
    const internalGlobal = global as any;
    internalGlobal.window = window;
    internalGlobal.document = document;

    Object.keys(entry)
      .map(item => getOutputPath(executionPath, item))
      .map(path => internalRequire(path))
      .reduce((agg, fileExports) => [...agg, ...Object.entries(fileExports)], [])
      .filter(([key]) => key !== 'default')
      .forEach(([key, fn]) => {
        const element = fn();
        const propSetName = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        setPropSetName(propSetName);
        ReactTestRenderer.create(element);
      });
  };
}
