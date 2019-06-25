import createComponentsWithMetadata from './createComponentsWithMetadata';

const PREFIX_PATH = `${process.cwd()}/`;

let entrypointsWithMetadata;
let compilerOutput;
let modules;

beforeEach(() => {
  entrypointsWithMetadata = {
    MainComponent: {
      entrypoint: `some-loader?MainComponent!${PREFIX_PATH}mc-endpoint`,
      filePath: 'mc-filePath',
      components: [
        {
          symbol: 'mc-c1-symbol',
          isDefaultExport: true
        },
        {
          symbol: 'mc-c2-symbol',
          isDefaultExport: false
        }
      ]
    },
    SmallerComponent: {
      entrypoint: `some-loader?MainComponent!${PREFIX_PATH}sc-endpoint`,
      filePath: 'sc-filePath',
      components: [
        {
          symbol: 'sc-c1-symbol',
          isDefaultExport: false
        },
        {
          symbol: 'sc-c2-symbol',
          isDefaultExport: true
        }
      ]
    }
  };
  compilerOutput = {
    MainComponent: 'content of main component',
    SmallerComponent: 'content of smaller component'
  };
  modules = [];
});

test('get components with metadata', () => {
  const result = createComponentsWithMetadata(
    entrypointsWithMetadata,
    compilerOutput,
    modules
  );
  expect(result).toEqual([
    {
      symbol: 'mc-c1-symbol',
      isDefaultExport: true,
      filePath: 'mc-endpoint',
      fileContent: 'content of main component',
      exportName: 'default',
      name: 'mc-c1-symbol'
    },
    {
      symbol: 'mc-c2-symbol',
      isDefaultExport: false,
      filePath: 'mc-endpoint',
      fileContent: 'content of main component',
      exportName: 'mc-c2-symbol',
      name: 'mc-c2-symbol'
    },
    {
      symbol: 'sc-c1-symbol',
      isDefaultExport: false,
      filePath: 'sc-endpoint',
      fileContent: 'content of smaller component',
      exportName: 'sc-c1-symbol',
      name: 'sc-c1-symbol'
    },
    {
      symbol: 'sc-c2-symbol',
      isDefaultExport: true,
      filePath: 'sc-endpoint',
      fileContent: 'content of smaller component',
      exportName: 'default',
      name: 'sc-c2-symbol'
    }
  ]);
});

test('fail to get components with metadata because entrypoint does not have correct syntax', () => {
  entrypointsWithMetadata.MainComponent.entrypoint = 'faulty_entrypoint';
  expect(() =>
    createComponentsWithMetadata(
      entrypointsWithMetadata,
      compilerOutput,
      modules
    )
  ).toThrowErrorMatchingSnapshot();
});

test("fail to get components with metadata because file path doesn't start with current path", () => {
  entrypointsWithMetadata.MainComponent.entrypoint =
    'some-loader?MainComponent!not_prefixed_path';
  expect(() =>
    createComponentsWithMetadata(
      entrypointsWithMetadata,
      compilerOutput,
      modules
    )
  ).toThrowErrorMatchingSnapshot();
});
