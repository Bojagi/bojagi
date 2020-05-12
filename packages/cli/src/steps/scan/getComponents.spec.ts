import getComponents from './getComponents';

test('get correctly marked components and exports', () => {
  const testFiles = [
    // no export
    `//@component
    const someCode = {}`,
    // named export
    `// @component
    export const someCode = () => <div></div>`,
    // no export
    `// @ component   
    const someCode = {}`,
    // named arrow export with newlines
    `// @component

    export const someCode = () => <div></div>`,
    // Multiple @ components
    `// @ component`,
    `// @component
    `,
    // comments before // @component
    `// test test test
     // @component
    export const someCode = () => <div></div>
    export default () => <div></div>
    export const otherCode () => <div></div>`,
    // default function
    `// @component
    export default function MyFnComponent () { return <div></div> }`,
    // default function multiline
    `// @component
    export default function    /* test */
MyNewlineComponent () {<div></div>}`,
    // default function with comments in between
    `// @component
    export default function    /* test // test */
    MyCommentFunctionComponent () {<div></div>}`,
    // named function export
    `// @component
    export function MyNamedFunctionComponent () {<div></div>}`,

    // styled-components default export
    `// @component
    export default styled.h1\`
      width: 100px;
    \`;
    `,
    // named function export with TypeScript generic
    `// @component
    export function MyNamedFunctionComponent<string> () {<div></div>}`,
    // default function with TypeScript generic
    `// @component
    export default function MyFnComponent<number> () { return <div></div> }`,
  ];

  const foundComponents = testFiles
    .map(testFile => getComponents('@component', 'this/is/the/path/to.the.file.js', testFile))
    .filter(testFile => !!testFile);

  expect(foundComponents.length).toBe(10);
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
        symbol: 'to.the.file',
        isDefaultExport: true,
      },
    ],
    [
      {
        symbol: 'MyFnComponent',
        isDefaultExport: true,
      },
    ],
    [
      {
        symbol: 'MyNewlineComponent',
        isDefaultExport: true,
      },
    ],
    [
      {
        symbol: 'MyCommentFunctionComponent',
        isDefaultExport: true,
      },
    ],
    [
      {
        symbol: 'MyNamedFunctionComponent',
        isDefaultExport: false,
      },
    ],
    [
      {
        symbol: 'to.the.file',
        isDefaultExport: true,
      },
    ],
    [
      {
        symbol: 'MyNamedFunctionComponent',
        isDefaultExport: false,
      },
    ],
    [
      {
        symbol: 'MyFnComponent',
        isDefaultExport: true,
      },
    ],
  ]);
});
