import { runWebpackCompiler } from './runWebpackCompiler';
import getGitPath from '../../utils/getGitPath';
import { clearDependencyMemory } from './dependencies';

jest.mock('../../utils/getGitPath');

(getGitPath as any).mockImplementation(resource => `gitpath/${resource}`);

let compiler;
let entrypoints;
let mockFs;
let mockError;
let mockOutput;
let fileContents;
let cwd;

afterEach(clearDependencyMemory);

beforeEach(() => {
  cwd = process.cwd();
  mockError = null;
  mockOutput = {
    compilation: {
      moduleGraph: {
        getModule: jest.fn(dep => dep.module),
      },
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
                    request: '../XXX.js',
                    module: {
                      resource: `${cwd}/src/components/XXX.js`,
                      // circular dependency
                      dependencies: [
                        {
                          request: './test.js',
                          module: {
                            resource: `${cwd}/src/components/test.js`,
                            dependencies: [
                              {
                                request: './something_ignored.js',
                                module: {
                                  resource: `${cwd}/src/components/something_ignored.js`,
                                  dependencies: [],
                                },
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                  {
                    request: './otherTest.js',
                    module: {
                      resource: `${cwd}/src/components/otherTest.js`,
                      // should be memorized
                      dependencies: [
                        {
                          request: '../XXX.js',
                          module: {
                            resource: `${cwd}/src/components/XXX.js`,
                            dependencies: [
                              {
                                // This resource should never be called because the parent dependency is memorized
                                request: './not-included.js',
                                module: {
                                  resource: `${cwd}/src/components/not-included.js`,
                                  dependencies: [],
                                },
                              },
                            ],
                          },
                        },
                      ],
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
    [`${cwd}/bojagi/vendors.js`]: 'vendors_source content',
    [`${cwd}/bojagi/A.css`]: 'A CSS content',
    [`${cwd}/bojagi/A.js`]: 'A JS content',
    [`${cwd}/bojagi/B.js`]: 'B JS content',
    [`${cwd}/bojagi/C.js`]: 'C JS content',
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

describe.each([[4], [5]])('Webpack version %s', webpackMajorVersion => {
  test('run the webpack compiler', async () => {
    const componentsContent = await runWebpackCompiler({
      compiler,
      entrypoints,
      dependencyPackages: [
        'react',
        '@material-ui/icons',
        'styled-components',
        'foreignNodeModules',
      ],
      webpackMajorVersion,
    });
    expect(componentsContent).toEqual({
      outputContent: {
        'A.css': 'A CSS content',
        'A.js': 'A JS content',
        'B.js': 'B JS content',
        'C.js': 'C JS content',
        'vendors.js': 'vendors_source content',
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
          isCircularImport: false,
          dependencies: [
            {
              filePath: `node_modules/react/index.js`,
              gitPath: `gitpath/node_modules/react/index.js`,
              isExternal: true,
              isNodeModule: true,
              isCircularImport: false,
              request: 'react',
              packageName: 'react',
            },
            {
              filePath: `../../node_modules/foreignNodeModules/index.js`,
              gitPath: `gitpath/../../node_modules/foreignNodeModules/index.js`,
              isExternal: false,
              isNodeModule: true,
              isCircularImport: false,
              request: 'foreignNodeModules',
              packageName: 'foreignNodeModules',
            },
            {
              filePath: `node_modules/@material-ui/icons/MyIcon/index.js`,
              gitPath: `gitpath/node_modules/@material-ui/icons/MyIcon/index.js`,
              isExternal: false,
              isNodeModule: true,
              isCircularImport: false,
              request: '@material-ui/icons/MyIcon',
              packageName: '@material-ui/icons',
            },
            // node module (no org)
            {
              isExternal: false,
              isNodeModule: true,
              isCircularImport: false,
              request: 'styled-components',
              packageName: 'styled-components',
              filePath: `node_modules/styled-components/index.js`,
              gitPath: `gitpath/node_modules/styled-components/index.js`,
            },
            // project module
            {
              isExternal: false,
              isNodeModule: false,
              isCircularImport: false,
              request: './test.js',
              filePath: `src/components/test.js`,
              gitPath: `gitpath/src/components/test.js`,
              dependencies: [
                {
                  filePath: 'src/components/XXX.js',
                  gitPath: 'gitpath/src/components/XXX.js',
                  isCircularImport: false,
                  isExternal: false,
                  isNodeModule: false,
                  packageName: undefined,
                  request: '../XXX.js',
                  dependencies: [
                    {
                      dependencies: undefined,
                      filePath: 'src/components/test.js',
                      gitPath: 'gitpath/src/components/test.js',
                      isCircularImport: true,
                      isExternal: false,
                      isNodeModule: false,
                      packageName: undefined,
                      request: './test.js',
                    },
                  ],
                },
                {
                  isExternal: false,
                  isNodeModule: false,
                  isCircularImport: false,
                  request: './otherTest.js',
                  filePath: `src/components/otherTest.js`,
                  gitPath: `gitpath/src/components/otherTest.js`,
                  dependencies: [
                    {
                      filePath: 'src/components/XXX.js',
                      gitPath: 'gitpath/src/components/XXX.js',
                      isCircularImport: false,
                      isExternal: false,
                      isNodeModule: false,
                      packageName: undefined,
                      request: '../XXX.js',
                      dependencies: [
                        {
                          dependencies: undefined,
                          filePath: 'src/components/test.js',
                          gitPath: 'gitpath/src/components/test.js',
                          isCircularImport: true,
                          isExternal: false,
                          isNodeModule: false,
                          packageName: undefined,
                          request: './test.js',
                        },
                      ],
                    },
                  ],
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
        webpackMajorVersion,
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
        webpackMajorVersion,
      })
    ).rejects.toThrow('some compilation error text');
  });
});
