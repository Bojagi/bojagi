import { callBojagiStoriesFactory } from './callBojagiStories';

test('call .bojagi.jsx files and make sure all functions except default are called', () => {
  const fileResponses = {
    '/some/path/.bojagi/tmp/collector/main/output/some/file.js': {
      a: jest.fn(() => null),
      default: jest.fn(() => null),
    },
    '/some/path/.bojagi/tmp/collector/main/output/some/otherfile.js': {
      x: jest.fn(() => null),
    },
  };
  const requireMock: any = jest.fn(id => fileResponses[id]);
  callBojagiStoriesFactory(requireMock)('/some/path', {
    'some/file.js': 'a',
    'some/otherfile.js': 'b',
  });
  expect(
    fileResponses['/some/path/.bojagi/tmp/collector/main/output/some/file.js'].a
  ).toHaveBeenCalled();
  expect(
    fileResponses['/some/path/.bojagi/tmp/collector/main/output/some/file.js'].default
  ).not.toHaveBeenCalled();
  expect(
    fileResponses['/some/path/.bojagi/tmp/collector/main/output/some/otherfile.js'].x
  ).toHaveBeenCalled();
});
