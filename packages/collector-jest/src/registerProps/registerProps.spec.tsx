import * as React from 'react';
import registerPropsFactory from './registerProps';

let registerProps;
let addProps;

const testPropType = (item, expectedType, expectedValue = item) => async () => {
  await registerProps('my/file.path', 'default', {
    item
  });
  expect(addProps).toHaveBeenCalledWith('my/file.path', 'default', {
    item: {
      value: expectedValue,
      type: expectedType
    }
  });
};

beforeEach(() => {
  addProps = jest.fn();
  registerProps = registerPropsFactory({ addProps });
});

test('register props when file export does not exist before and create entry', async () => {
  await registerProps('my/file.path', 'default', {
    someProp: 3,
    children: 'my content'
  });
  expect(addProps).toHaveBeenCalledTimes(1);
  expect(addProps).toHaveBeenCalledWith('my/file.path', 'default', {
    someProp: {
      value: 3,
      type: 'number'
    },
    children: {
      value: 'my content',
      type: 'string'
    }
  });
});

test('get string prop', testPropType('my content', 'string'));
test(
  'get array prop',
  testPropType(['my content', 123], 'array', [
    {
      type: 'string',
      value: 'my content'
    },
    {
      type: 'number',
      value: 123
    }
  ])
);
test('get number prop', testPropType(1, 'number'));
test('get boolean prop', testPropType(true, 'boolean'));
test(
  'get react element (html) prop',
  testPropType(<span>something</span>, 'html', '<span>something</span>')
);
test(
  'get object prop',
  testPropType(
    {
      v: 'some value',
      fnVal: () => 'should not show up'
    },
    'object',
    { v: 'some value' }
  )
);

test('get function prop with direct call', () => {
  const jestFn: any = jest.fn((_a, _b) => 'something');
  jestFn.mock.callPromise = new Promise(_resolve => '');
  jestFn('abc', 123);
  return testPropType(jestFn, 'function', {
    args: ['abc', 123],
    returnType: 'return',
    returnValue: 'something'
  })();
});

// test('get function prop with async call', async () => {
//   const jestFn: any = jest.fn((_a, _b) => 'something');
//   jestFn.mock.callPromise = new Promise(resolve => setTimeout(() => {
//     jestFn('abc', 123);
//     resolve();
//   }, 20));

//   await registerProps('my/file.path', 'default', {
//     item: jestFn,
//   });

//   expect(Array.from(propsRegistry.entries())).toEqual([
//     ['my/file.path.default', {
//       filePath: 'my/file.path',
//       exportName: 'default',
//       props: [{
//         item: {
//           value: {},
//           type: 'function',
//         },
//       }],
//     }],
//   ]);

//   await new Promise((resolve) => setTimeout(resolve, 30));

//   expect(Array.from(propsRegistry.entries())).toEqual([
//     ['my/file.path.default', {
//       filePath: 'my/file.path',
//       exportName: 'default',
//       props: [{
//         item: {
//           value: {
//             args: ['abc', 123],
//             returnType: 'return',
//             returnValue: 'something',
//           },
//           type: 'function',
//         },
//       }],
//     }],
//   ]);
// });

test('get function prop that is not a jest fn and return UNKNOWN prop type', () => {
  const jestFn: any = (_a, _b) => 'something';
  jestFn('abc', 123);
  return testPropType(jestFn, 'unknown', {})();
});

test('register props with react element children', async () => {
  await registerProps('my/file.path', 'default', {
    someProp: React.createElement('strong', {}, [
      'abc',
      React.createElement('span', { key: 'x' }, 'aaa')
    ]),
    children: [
      'my ',
      React.createElement('strong', { key: 'x' }, 'super'),
      ' child'
    ]
  });
  expect(addProps).toHaveBeenCalledWith('my/file.path', 'default', {
    someProp: {
      value: '<strong>abc<span>aaa</span></strong>',
      type: 'html'
    },
    children: [
      {
        value: 'my ',
        type: 'string'
      },
      {
        type: 'html',
        value: '<strong>super</strong>'
      },
      {
        value: ' child',
        type: 'string'
      }
    ]
  });
});
