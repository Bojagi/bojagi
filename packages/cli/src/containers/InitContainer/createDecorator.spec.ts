import * as path from 'path';
import { createDecorator } from './createDecorator';

let fsMock;

beforeEach(() => {
  fsMock = {
    existsSync: jest.fn(),
    mkdirSync: jest.fn(),
    copyFileSync: jest.fn(),
  };
});

test('create decorator with .bojagi folder not existing', () => {
  fsMock.existsSync.mockReturnValue(false);
  createDecorator(fsMock, '/abc/');

  expect(fsMock.mkdirSync).toHaveBeenCalledTimes(1);
  expect(fsMock.mkdirSync).toHaveBeenCalledWith('/abc/.bojagi');

  expect(fsMock.copyFileSync).toHaveBeenCalledTimes(1);
  expect(fsMock.copyFileSync).toHaveBeenCalledWith(
    path.join(__dirname, '../../../boilerplateDecorator.jsx'),
    '/abc/.bojagi/decorator.js'
  );
});

test('create decorator with .bojagi folder existing', () => {
  fsMock.existsSync.mockReturnValue(true);
  createDecorator(fsMock, '/abc/');

  expect(fsMock.mkdirSync).toHaveBeenCalledTimes(0);

  expect(fsMock.copyFileSync).toHaveBeenCalledTimes(1);
  expect(fsMock.copyFileSync).toHaveBeenCalledWith(
    path.resolve(__dirname, '../../../boilerplateDecorator.jsx'),
    '/abc/.bojagi/decorator.js'
  );
});
