import getEntrypointsFromComponents from './getEntrypointsFromComponents';

test('with components', () => {
  const components = [
    {
      filePath: 'abc/cde.jsx',
    },
    {
      filePath: 'xxxxxx/ajfaef/afdjaefae/daefa33e/abc/xyz.jsx',
    },
  ];

  const entrypoints = getEntrypointsFromComponents(components);
  expect(entrypoints).toEqual({
    cde: {
      filePath: 'abc/cde.jsx',
      entrypoint: 'component-extract-loader?cde!abc/cde.jsx',
    },
    xyz: {
      filePath: 'xxxxxx/ajfaef/afdjaefae/daefa33e/abc/xyz.jsx',
      entrypoint: 'component-extract-loader?xyz!xxxxxx/ajfaef/afdjaefae/daefa33e/abc/xyz.jsx',
    },
  });
});

test('with no components', () => {
  const components = [];
  const entrypoints = getEntrypointsFromComponents(components);
  expect(entrypoints).toEqual({});
});
