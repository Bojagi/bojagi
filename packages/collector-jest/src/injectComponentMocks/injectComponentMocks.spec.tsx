import * as React from 'react';
import injectComponentMocksFactory from './injectComponentMocks';

let injectComponentMocks;
let jestMock;
let componentsAvailable;
let getComponents;
let registerProps;
let executionPath;

beforeEach(() => {
  executionPath = 'execution/path';
  registerProps = jest.fn();

  componentsAvailable = jest.fn();
  getComponents = jest.fn();

  jestMock = {
    requireActual: jest.fn(),
    setMock: jest.fn(),
    fn: jest.fn
  };

  injectComponentMocks = injectComponentMocksFactory({
    executionPath,
    componentsAvailable,
    getComponents,
    registerProps,
    jest: jestMock,
    extendedJestFn: jestMock.fn
  });
});

test('Do nothing if file does not exist', () => {
  componentsAvailable.mockReturnValue(false);
  injectComponentMocks();
  expect(jestMock.setMock).not.toHaveBeenCalled();
});

test('Mock all exported components', () => {
  componentsAvailable.mockReturnValue(true);
  getComponents.mockReturnValue([
    {
      filePath: 'some/path/to/file.js',
      exportName: 'default'
    },
    {
      filePath: 'some/path/to.js',
      exportName: 'xxx'
    },
    {
      filePath: 'some/path/to/file.js',
      exportName: 'notDefault'
    }
  ]);
  injectComponentMocks();
  expect(jestMock.setMock).toHaveBeenCalledTimes(2);
  expect(jestMock.setMock).toHaveBeenCalledWith(
    'execution/path/some/path/to.js',
    {
      __esModule: true,
      xxx: expect.any(Function)
    }
  );
  expect(jestMock.setMock).toHaveBeenCalledWith(
    'execution/path/some/path/to/file.js',
    {
      __esModule: true,
      default: expect.any(Function),
      notDefault: expect.any(Function)
    }
  );
});

test('Wrap component with HOC that registers props', () => {
  componentsAvailable.mockReturnValue(true);
  getComponents.mockReturnValue([
    {
      filePath: 'some/path/to/file.js',
      exportName: 'default'
    }
  ]);
  jestMock.requireActual.mockReturnValue({
    default: jest.fn(props => <div>{props.prop}</div>)
  });
  injectComponentMocks();
  expect(registerProps).not.toHaveBeenCalled();
  const returnedElement = jestMock.setMock.mock.calls[0][1].default({
    prop: 'something',
    fnProp: (arg: any) => `hello ${arg}`
  });
  expect(registerProps).toHaveBeenCalledWith(
    'some/path/to/file.js',
    'default',
    {
      prop: 'something',
      fnProp: expect.any(Function)
    }
  );
  expect(registerProps.mock.calls[0][2].fnProp.mock).toBeDefined();
  expect(returnedElement.type).toBe('div');
});

test("Don't register component if export is not a react component", () => {
  componentsAvailable.mockReturnValue(true);
  getComponents.mockReturnValue([
    {
      filePath: 'some/path/to/file.js',
      exportName: 'default'
    }
  ]);
  jestMock.requireActual.mockReturnValue({
    default: jest.fn(props => 'something')
  });
  injectComponentMocks();
  expect(registerProps).not.toHaveBeenCalled();
  const returnedValue = jestMock.setMock.mock.calls[0][1].default({
    prop: 'something'
  });
  expect(registerProps).not.toHaveBeenCalled();
  expect(returnedValue).toBe('something');
});
