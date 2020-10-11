import { runWebpackCompiler } from './runWebpackCompiler';
import getGitPath from '../../utils/getGitPath';

jest.mock('../../utils/getGitPath');

(getGitPath as any).mockImplementation(resource => `gitpath/${resource}`);

let compiler;
let entrypoints;
let mockFs;
let mockError;
let mockOutput;
let fileContents;
let cwd;

beforeEach(() => {
  cwd = process.cwd();
  mockError = null;
  mockOutput = {
    compilation: {
      errors: [],
      entrypoints: new Map([
        [
          'A',
          {
            getFiles: jest.fn(() => ['vendors.js', 'A.css', 'A.js']),
          },
        ],
        [
          'B',
          {
            getFiles: jest.fn(() => ['vendors.js', 'B.js']),
          },
        ],
        [
          'C',
          {
            getFiles: jest.fn(() => ['vendors.js', 'C.js']),
          },
        ],
      ]),
      assets: {
        'vendors.js': { source: jest.fn(() => 'vendors_source') },
        'A.css': { source: jest.fn(() => 'A CSS') },
        'A.js': { source: jest.fn(() => 'A JS') },
        'B.js': { source: jest.fn(() => 'B JS') },
        'C.js': { source: jest.fn(() => 'C JS') },
      },
      modules: [
        {
          rawRequest: `component-extract-loader?${cwd}/bojagi/A.js`,
          resource: `${cwd}/bojagi/A.js`,
          dependencies: [],
        },
        {
          rawRequest: `${cwd}/bojagi/A.js`,
          resource: `${cwd}/bojagi/A.js`,
          dependencies: [
            // External module (react)
            {
              request: 'react',
              module: {
                resource: `${cwd}/node_modules/react/index.js`,
                external: true,
                dependencies: [],
              },
            },
            {
              request: '@babel/core',
              module: {
                resource: `${cwd}/node_modules/@babel/core/index.js`,
                external: false,
                dependencies: [],
              },
            },
            {
              request: 'foreignNodeModules',
              module: {
                resource: `../../node_modules/foreignNodeModules/index.js`,
                dependencies: [],
              },
            },
            // node module of org
            {
              request: '@material-ui/icons/MyIcon',
              module: {
                resource: `${cwd}/node_modules/@material-ui/icons/MyIcon/index.js`,
                dependencies: [],
              },
            },
            // node module (no org)
            {
              request: 'styled-components',
              module: {
                resource: `${cwd}/node_modules/styled-components/index.js`,
                dependencies: [],
              },
            },
            // project module
            {
              request: './test.js',
              module: {
                resource: `${cwd}/src/components/test.js`,
                dependencies: [
                  // project module
                  {
                    request: './otherTest.js',
                    module: {
                      resource: `${cwd}/src/components/otherTest.js`,
                      dependencies: [],
                    },
                  },
                ],
              },
            },
          ],
        },
      ],
    },
  };
  fileContents = {
    [`${cwd}/bojagi/A.js`]: 'file content a',
    [`${cwd}/bojagi/B.js`]: 'file content b',
    [`${cwd}/bojagi/C.js`]: 'file content c',
    [`${cwd}/bojagi/commons.js`]: 'commons file content',
  };

  mockFs = {
    readFileSync: jest.fn(path => fileContents[path]),
    existsSync: jest.fn(() => true),
  };
  entrypoints = {
    A: [`A!${cwd}/bojagi/A.js`],
    B: [`B!${cwd}/bojagi/B.js`],
    C: [`C!${cwd}/bojagi/C.js`],
  };
  compiler = {
    run: jest.fn(runCb => runCb(mockError, mockOutput)),
    outputFileSystem: mockFs,
  };
});

test('run the webpack compiler', async () => {
  const componentsContent = await runWebpackCompiler({
    compiler,
    entrypoints,
    dependencyPackages: ['react', '@material-ui/icons', 'styled-components', 'foreignNodeModules'],
  });
  expect(componentsContent).toEqual({
    outputContent: {
      'A.css': 'A CSS',
      'A.js': 'A JS',
      'B.js': 'B JS',
      'C.js': 'C JS',
      'vendors.js': 'vendors_source',
    },
    assets: {
      A: ['vendors.js', 'A.css', 'A.js'],
      B: ['vendors.js', 'B.js'],
      C: ['vendors.js', 'C.js'],
    },
    modules: [
      {
        filePath: `bojagi/A.js`,
        gitPath: 'gitpath/bojagi/A.js',
        isExternal: false,
        isNodeModule: false,
        dependencies: [
          {
            filePath: `node_modules/react/index.js`,
            gitPath: `gitpath/node_modules/react/index.js`,
            isExternal: true,
            isNodeModule: true,
            request: 'react',
            packageName: 'react',
          },
          {
            filePath: `../../node_modules/foreignNodeModules/index.js`,
            gitPath: `gitpath/../../node_modules/foreignNodeModules/index.js`,
            isExternal: false,
            isNodeModule: true,
            request: 'foreignNodeModules',
            packageName: 'foreignNodeModules',
          },
          {
            filePath: `node_modules/@material-ui/icons/MyIcon/index.js`,
            gitPath: `gitpath/node_modules/@material-ui/icons/MyIcon/index.js`,
            isExternal: false,
            isNodeModule: true,
            request: '@material-ui/icons/MyIcon',
            packageName: '@material-ui/icons',
          },
          // node module (no org)
          {
            isExternal: false,
            isNodeModule: true,
            request: 'styled-components',
            packageName: 'styled-components',
            filePath: `node_modules/styled-components/index.js`,
            gitPath: `gitpath/node_modules/styled-components/index.js`,
          },
          // project module
          {
            isExternal: false,
            isNodeModule: false,
            request: './test.js',
            filePath: `src/components/test.js`,
            gitPath: `gitpath/src/components/test.js`,
            dependencies: [
              {
                isExternal: false,
                isNodeModule: false,
                request: './otherTest.js',
                filePath: `src/components/otherTest.js`,
                gitPath: `gitpath/src/components/otherTest.js`,
                dependencies: [],
              },
            ],
          },
        ],
      },
    ],
  });
});

test('run webpack compiler with error', async () => {
  mockError = new Error('some error text');
  await expect(
    runWebpackCompiler({
      compiler,
      entrypoints,
      dependencyPackages: ['react', '@material-ui/icons', 'styled-components'],
    })
  ).rejects.toThrow('some error text');
});

test('run webpack compiler with compilation error', async () => {
  mockOutput = {
    compilation: {
      errors: [new Error('some compilation error text')],
    },
  };
  await expect(
    runWebpackCompiler({
      compiler,
      entrypoints,
      dependencyPackages: ['react', '@material-ui/icons', 'styled-components'],
    })
  ).rejects.toThrow('some compilation error text');
});
