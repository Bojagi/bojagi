import { replaceWebpackRules } from './replaceWebpackRules';

test('replace the current rules of the given webpack config with a new set given by the cb fn', () => {
  expect(
    replaceWebpackRules(
      {
        module: { rules: [{ loader: 'a' }, { loader: 'b' }] },
      } as any,
      () => [{ loader: 'c' }]
    ).module?.rules
  ).toEqual([{ loader: 'c' }]);
});

test('keep the rest of the webpack config intact', () => {
  expect(
    replaceWebpackRules(
      { rest: 'of', the: 'config', module: { rules: ['a', 'b'] } } as any,
      () => []
    )
  ).toEqual({ rest: 'of', the: 'config', module: { rules: [] } });
});

test('pass old rules to cb fn', () => {
  const getRules = jest.fn(() => []);
  replaceWebpackRules(
    {
      module: { rules: ['a', 'b'] },
    } as any,
    getRules
  );

  expect(getRules).toHaveBeenCalledWith(['a', 'b']);
});

test('work with empty module', () => {
  const getRules = jest.fn(() => []);
  expect(replaceWebpackRules({ rest: 'of', the: 'config' } as any, getRules)).toEqual({
    rest: 'of',
    the: 'config',
  });

  expect(getRules).not.toHaveBeenCalled();
});
