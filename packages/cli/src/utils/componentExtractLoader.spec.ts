import { pitch as _pitch } from './componentExtractLoader';

let self;
let pitch;
const remainingRequest =
  '/home/MyAccount/project/node_modules/babel-loader/lib/index.js??ref--0!/home/MyAccount/project/Abc/Abc.jsx';

beforeEach(() => {
  self = {
    cacheable: jest.fn(),
    context: '/home/MyAccount/project/Abc',
    resourcePath: '/home/MyAccount/project/Abc/Abc.jsx',
    query: '?MyComponent',
  };
  pitch = _pitch.bind(self);
});

test('happy path', () => {
  const result = pitch(remainingRequest);
  expect(result).toBe(`
    var componentModule = require("-!/home/MyAccount/project/node_modules/babel-loader/lib/index.js??ref--0!./Abc.jsx");
    registerComponent("MyComponent", componentModule);
    module.exports = componentModule;
  `);
  expect(self.cacheable.mock.calls.length).toBe(1);
});

test("Don't throw error when there is no cachable fn", () => {
  self.cacheable = null;
  pitch(remainingRequest);
});

test('Throw error when there is no query parameter', () => {
  self.query = null;
  expect(() => {
    pitch(remainingRequest);
  }).toThrow('query parameter is missing');
});
