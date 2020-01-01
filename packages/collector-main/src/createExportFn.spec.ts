import { createExportFnFactory } from './createExportFn';
import { setPropSetName } from './propSetNameContext';

test('abc', () => {
  const registerProps = jest.fn();
  const createExportFn = createExportFnFactory(registerProps);
  setPropSetName('some propset name');
  createExportFn({ filePath: '/my/file/path.js', exportName: 'MyComponent' })({
    a: 'myComponent',
    b: () => 'hihi',
    c: 123,
    d: true,
  });
  expect(registerProps).toHaveBeenCalledWith(
    '/my/file/path.js',
    'MyComponent',
    {
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
    'some propset name'
  );
});
