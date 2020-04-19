import * as ReactTestRenderer from 'react-test-renderer';
import { JSDOM } from 'jsdom';
import { setPropSetKey, setStoryPath } from './propSetNameContext';
import { getOutputPath } from './pathFactories';

export const callBojagiStories = callBojagiStoriesFactory(require);

export function callBojagiStoriesFactory(internalRequire: NodeRequire) {
  return (executionPath: string, entry: Record<string, string>) => {
    const { window } = new JSDOM('<body></body>');
    const internalGlobal = global as any;
    internalGlobal.window = window;
    internalGlobal.document = window.document;

    return Promise.all(
      Object.keys(entry)
        .map(item => [item, getOutputPath(executionPath, item)])
        .map(([item, path]) => [item, internalRequire(path)])
        .map(callStoriesOfFile)
    );
  };
}

function callStoriesOfFile([path, exp]: [string, Record<string, Function>]) {
  setStoryPath(path);
  return Promise.all(
    Object.entries(exp)
      .filter(([key]) => key !== 'default')
      .map(async ([key, fn]) => {
        const element = fn();
        setPropSetKey(key);
        await ReactTestRenderer.create(element);
      })
  );
}
