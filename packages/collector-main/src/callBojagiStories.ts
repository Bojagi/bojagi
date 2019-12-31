import * as ReactTestRenderer from 'react-test-renderer';
import { writeRegisteredProps } from '@bojagi/collector-base';
import { JSDOM } from 'jsdom';
import { setPropSetName } from './propSetNameContext';

export function callBojagiStories(executionPath: string, entry: Record<string, string>) {
  const { window, document } = new JSDOM('<body></body>');
  const internalGlobal = global as any;
  internalGlobal.window = window;
  internalGlobal.document = document;

  Object.keys(entry)
    .map(item => `${executionPath}/.bojagi/tmp/collector/main/output/${item}`)
    .map(path => require(path))
    .reduce(
      (agg, fileExports) => [
        ...agg,
        ...Object.entries(fileExports).filter(([key]) => key !== 'default'),
      ],
      []
    )
    .forEach(([key, fn]) => {
      const element = fn();
      const propSetName = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      setPropSetName(propSetName);
      ReactTestRenderer.create(element);
    });
  writeRegisteredProps();
}
