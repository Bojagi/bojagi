import { getDependencyVersion } from './getDependencyVersion';

let mockFileContents;
let fsMock;

beforeEach(() => {
  mockFileContents = {};

  fsMock = {
    existsSync: jest.fn(path => !!mockFileContents[path]),
    readFileSync: jest.fn(path => Buffer.from(JSON.stringify(mockFileContents[path]))),
  };
});

test('Return undefined when folder path is at the top of the file system', () => {
  const result = getDependencyVersion('/', 'react', fsMock);
  expect(result).toBeUndefined();
});

test('Find dependency version directly in first file path', () => {
  mockFileContents['/a/b/c/d/e/package.json'] = {
    dependencies: {
      react: '16.13.1',
    },
  };
  const result = getDependencyVersion('/a/b/c/d/e', 'react', fsMock);
  expect(result).toBe('16.13.1');
});

test('Find dependency version from the first up the path that has dependency', () => {
  mockFileContents['/a/package.json'] = {
    dependencies: {
      react: '17.0.0',
    },
  };

  mockFileContents['/a/b/c/package.json'] = {
    dependencies: {
      notReact: '17.0.0',
    },
  };

  const result = getDependencyVersion('/a/b/c/d/e', 'react', fsMock);
  expect(result).toBe('17.0.0');
});
