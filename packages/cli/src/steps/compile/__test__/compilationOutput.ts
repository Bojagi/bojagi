export function webpackCompilationOutput() {
  const cwd = process.cwd();
  return {
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
              external: true,
              request: 'react',
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
  };
}

export function compilationDependencies() {
  return {
    'bojagi/A.js': {
      id: `bojagi/A.js`,
      filePath: `bojagi/A.js`,
      gitPath: 'gitpath/bojagi/A.js',
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
        { dependency: 'src/components/test.js', request: './test.js' },
      ],
    },
    react: {
      id: 'react',
      isExternal: true,
      isNodeModule: false,
      packageName: 'react',
      dependencies: [],
    },
    foreignNodeModules: {
      id: 'foreignNodeModules',
      isExternal: false,
      isNodeModule: true,
      packageName: 'foreignNodeModules',
      dependencies: [],
    },
    '@material-ui/icons': {
      id: '@material-ui/icons',
      isExternal: false,
      isNodeModule: true,
      packageName: '@material-ui/icons',
      dependencies: [],
    },
    // node module (no org)
    'styled-components': {
      id: 'styled-components',
      isExternal: false,
      isNodeModule: true,
      packageName: 'styled-components',
      dependencies: [],
    },
    'src/components/test.js': {
      id: `src/components/test.js`,
      isExternal: false,
      isNodeModule: false,
      filePath: `src/components/test.js`,
      gitPath: `gitpath/src/components/test.js`,
      dependencies: [
        { dependency: 'src/components/XXX.js', request: '../XXX.js' },
        { dependency: `src/components/otherTest.js`, request: './otherTest.js' },
      ],
    },
    'src/components/XXX.js': {
      id: 'src/components/XXX.js',
      filePath: 'src/components/XXX.js',
      gitPath: 'gitpath/src/components/XXX.js',
      isExternal: false,
      isNodeModule: false,
      packageName: undefined,
      dependencies: [{ dependency: 'src/components/test.js', request: './test.js' }],
    },
    'src/components/otherTest.js': {
      id: `src/components/otherTest.js`,
      isExternal: false,
      isNodeModule: false,
      filePath: `src/components/otherTest.js`,
      gitPath: `gitpath/src/components/otherTest.js`,
      dependencies: [{ dependency: 'src/components/XXX.js', request: '../XXX.js' }],
    },
  };
}
