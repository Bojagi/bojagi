import { serveComponentsApi } from './serveComponentsApi';

test('get components API output', () => {
  const config: any = {
    previewPort: 1234,
    executionPath: '/some/path',
  };

  const entrypointsWithMetadata = {
    file1: {
      entrypoint: 'file1',
      filePath: '/some/path/some/file.ts',
      components: [
        {
          symbol: 'sym1',
          isDefaultExport: true,
        },
        {
          symbol: 'sym2',
          isDefaultExport: false,
        },
      ],
    },
    file2: {
      entrypoint: 'file1',
      filePath: '/some/path/some/feli.ts',
      components: [
        {
          symbol: 'sym3',
          isDefaultExport: false,
        },
      ],
    },
  };

  const componentProps: any = [
    {
      filePath: 'some/feli.ts',
      exportName: 'sym3',
      props: [
        {
          name: 'Y',
          any: 'js' as any,
          createdBy: 'cli',
          propSet: {
            a: 1,
            b: 'x',
          },
        },
        {
          name: 'Z',
          any: 'js' as any,
          createdBy: 'cli',
          propSet: {
            a: 10,
            b: 'y',
          },
        },
      ],
    },
    {
      filePath: 'some/file.ts',
      exportName: 'sym2',
      props: [
        {
          name: 'K',
          any: 'json' as any,
          createdBy: 'cli',
          propSet: {
            a: 3,
            b: 'z',
          },
        },
      ],
    },
  ];

  const result = serveComponentsApi({
    entrypointsWithMetadata,
    config,
    componentProps,
  });

  expect(result).toEqual({
    files: [
      {
        url: 'http://localhost:1234/commons.js',
      },
    ],
    components: [
      {
        url: `http://localhost:1234/sym1.js`,
        id: 'sym1',
        exportName: 'default',
        symbol: 'sym1',
        props: [],
      },
      {
        url: `http://localhost:1234/sym2.js`,
        id: 'sym2',
        exportName: 'sym2',
        symbol: 'sym2',
        props: [
          {
            name: 'K',
            any: 'json' as any,
            createdBy: 'test-collector',
            propSet: JSON.stringify({
              a: 3,
              b: 'z',
            }),
          },
        ],
      },
      {
        url: `http://localhost:1234/sym3.js`,
        id: 'sym3',
        exportName: 'sym3',
        symbol: 'sym3',
        props: [
          {
            name: 'Y',
            any: 'js' as any,
            createdBy: 'test-collector',
            propSet: JSON.stringify({
              a: 1,
              b: 'x',
            }),
          },
          {
            name: 'Z',
            any: 'js' as any,
            createdBy: 'test-collector',
            propSet: JSON.stringify({
              a: 10,
              b: 'y',
            }),
          },
        ],
      },
    ],
  });
});
