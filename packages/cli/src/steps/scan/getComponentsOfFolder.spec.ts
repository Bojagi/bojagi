import getComponentsOfFolder from './getComponentsOfFolder';

test('Get components', async () => {
  const components = await getComponentsOfFolder(
    '@component',
    `${__dirname}/__testHelpers__/files`
  );
  const expectedComponents = [
    {
      filePath: `${__dirname}/__testHelpers__/files/abc/Cde.tsx`,
      components: [
        {
          symbol: 'Cdee',
          isDefaultExport: false,
        },
      ],
    },
    {
      filePath: `${__dirname}/__testHelpers__/files/abc/Xyz.jsx`,
      components: [
        {
          symbol: 'Xxx',
          isDefaultExport: false,
        },
        {
          symbol: 'Xyz',
          isDefaultExport: true,
        },
      ],
    },
    {
      filePath: `${__dirname}/__testHelpers__/files/xyz/xxx/SomeComponent.tsx`,
      components: [
        {
          symbol: 'SomeComponent',
          isDefaultExport: false,
        },
      ],
    },
  ];

  expect(components).toEqual(expectedComponents);
});
