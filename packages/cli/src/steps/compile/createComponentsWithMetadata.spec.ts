import createComponentsWithMetadata from './createComponentsWithMetadata';

let scanComponents;
let compilerOutput;
let modules;

beforeEach(() => {
  scanComponents = [
    {
      fileName: 'MainComponent',
      filePath: 'mc-filePath',
      symbol: 'mc-c1-symbol',
      exportName: 'default',
      name: 'mc-c1-symbol',
      isDefaultExport: true,
    },
    {
      fileName: 'MainComponent',
      filePath: 'mc-filePath',
      exportName: 'mc-c2-symbol',
      symbol: 'mc-c2-symbol',
      name: 'mc-c2-symbol',
      isDefaultExport: false,
    },
    {
      fileName: 'SmallerComponent',
      filePath: 'sc-filePath',
      symbol: 'sc-c1-symbol',
      exportName: 'sc-c1-symbol',
      name: 'sc-c1-symbol',
      isDefaultExport: false,
    },
    {
      fileName: 'SmallerComponent',
      filePath: 'sc-filePath',
      symbol: 'sc-c2-symbol',
      exportName: 'default',
      name: 'sc-c2-symbol',
      isDefaultExport: true,
    },
  ];
  compilerOutput = {
    MainComponent: 'content of main component',
    SmallerComponent: 'content of smaller component',
  };
  modules = [
    {
      filePath: 'sc-filePath',
      dependencies: 'some deps',
    },
  ];
});

test('get components with metadata', () => {
  const result = createComponentsWithMetadata(scanComponents, compilerOutput, modules);
  expect(result).toEqual([
    {
      fileName: 'MainComponent',
      symbol: 'mc-c1-symbol',
      isDefaultExport: true,
      filePath: 'mc-filePath',
      fileContent: 'content of main component',
      exportName: 'default',
      name: 'mc-c1-symbol',
    },
    {
      fileName: 'MainComponent',
      symbol: 'mc-c2-symbol',
      isDefaultExport: false,
      filePath: 'mc-filePath',
      fileContent: 'content of main component',
      exportName: 'mc-c2-symbol',
      name: 'mc-c2-symbol',
    },
    {
      fileName: 'SmallerComponent',
      symbol: 'sc-c1-symbol',
      isDefaultExport: false,
      filePath: 'sc-filePath',
      fileContent: 'content of smaller component',
      exportName: 'sc-c1-symbol',
      name: 'sc-c1-symbol',
      dependencies: 'some deps',
    },
    {
      fileName: 'SmallerComponent',
      symbol: 'sc-c2-symbol',
      isDefaultExport: true,
      filePath: 'sc-filePath',
      fileContent: 'content of smaller component',
      exportName: 'default',
      name: 'sc-c2-symbol',
      dependencies: 'some deps',
    },
  ]);
});
