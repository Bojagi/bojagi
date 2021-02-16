import { runWebpackCompiler } from './runWebpackCompiler';
import { compilationDependencies, webpackCompilationOutput } from './__test__/compilationOutput';

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
    compilation: webpackCompilationOutput(),
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
      projectGitPath: cwd,
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
      dependencies: compilationDependencies(),
      modules: [
        {
          id: `gitpath/bojagi/A.js`,
          filePath: `bojagi/A.js`,
          gitPath: 'bojagi/A.js',
          isExternal: false,
          isNodeModule: false,
          dependencies: [
            {
              dependency: 'react',
              request: 'react',
            },
            { dependency: 'foreignNodeModules', request: 'foreignNodeModules' },
            { dependency: '@material-ui/icons', request: '@material-ui/icons/MyIcon' },
            { dependency: 'styled-components', request: 'styled-components' },
            { dependency: 'gitpath/src/components/test.js', request: './test.js' },
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
        projectGitPath: cwd,
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
        projectGitPath: cwd,
      })
    ).rejects.toThrow('some compilation error text');
  });
});
