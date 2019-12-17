import getComponents from './getComponents';

test('get correctly marked components and exports', () => {
  const testFiles = [
    `//@component
    const someCode = {}`,
    `// @component
    export const someCode = () => <div></div>`,
    `// @ component   
    const someCode = {}`,
    `// @component

    export const someCode = () => <div></div>`,
    `// @ component`,
    `// @component
    `,
    `// test test test
     // @component
    export const someCode = () => <div></div>
    export default () => <div></div>
    export const otherCode () => <div></div>`,
  ];

  const foundComponents = testFiles
    .map(testFile => getComponents(testFile))
    .filter(testFile => !!testFile);

  expect(foundComponents.length).toBe(3);
  expect(foundComponents).toEqual([
    [
      {
        symbol: 'someCode',
        isDefaultExport: false,
      },
    ],
    [
      {
        symbol: 'someCode',
        isDefaultExport: false,
      },
    ],
    [
      {
        symbol: 'someCode',
        isDefaultExport: false,
      },
      {
        symbol: 'otherCode',
        isDefaultExport: false,
      },
      {
        symbol: '()',
        isDefaultExport: true,
      },
    ],
  ]);
});
