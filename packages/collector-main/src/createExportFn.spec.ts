import { createExportFnFactory } from './createExportFn';
import { setPropSetKey, setStoryPath } from './propSetNameContext';

test('call created export fn with props and expect props to be registered', () => {
  const registerProps = jest.fn();
  const createExportFn = createExportFnFactory(registerProps);
  setPropSetKey('somePropsetName');
  setStoryPath('some/story/path');
  createExportFn({ filePath: '/my/file/path.js', exportName: 'MyComponent' })({
    a: 'myComponent',
    b: () => 'hihi',
    c: 123,
    d: true,
  });
  expect(registerProps).toHaveBeenCalledWith({
    filePath: '/my/file/path.js',
    exportName: 'MyComponent',
    propSet: {
      a: {
        value: 'myComponent',
        type: 'string',
      },
      b: {
        value: {
          args: [],
          returnType: 'unknown',
          returnValue: undefined,
        },
        type: 'function',
      },
      c: {
        value: 123,
        type: 'number',
      },
      d: {
        value: true,
        type: 'boolean',
      },
    },
    name: 'Some Propset Name',
    propSetType: 'js',
    storyPath: 'some__story__path',
    storySymbol: 'somePropsetName',
  });
});
