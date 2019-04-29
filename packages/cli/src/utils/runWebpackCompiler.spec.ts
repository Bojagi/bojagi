import runWebpackCompiler from './runWebpackCompiler';

let compiler;
let entrypoints;
let mockFs;
let mockError;
let mockOutput;
let fileContents;

beforeEach(() => {
  mockError = null;
  mockOutput = null;
  const cwd = process.cwd();
  fileContents = {
    [`${cwd}/bojagi/A.js`]: 'file content a',
    [`${cwd}/bojagi/B.js`]: 'file content b',
    [`${cwd}/bojagi/C.js`]: 'file content c',
    [`${cwd}/bojagi/commons.js`]: 'commons file content'
  };

  mockFs = {
    readFileSync: jest.fn(path => fileContents[path])
  };
  entrypoints = {
    A: 'not important',
    B: 'not important',
    C: 'not important'
  };
  compiler = {
    run: jest.fn(runCb => runCb(mockError, mockOutput)),
    outputFileSystem: mockFs
  };
});

test('run the webpack compiler', async () => {
  const componentsContent = await runWebpackCompiler({ compiler, entrypoints });
  expect(componentsContent).toEqual({
    commons: 'commons file content',
    A: 'file content a',
    B: 'file content b',
    C: 'file content c'
  });
});

test('run webpack compiler with error', async () => {
  mockError = new Error('some error text');
  await expect(runWebpackCompiler({ compiler, entrypoints })).rejects.toThrow(
    'some error text'
  );
});
