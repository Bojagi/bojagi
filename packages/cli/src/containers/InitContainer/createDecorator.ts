import * as path from 'path';
import { getFS } from '../../dependencies';

const fileSystem = getFS();

export function createDecorator(fs: typeof fileSystem, executionPath: string) {
  const bojagiFolder = path.join(executionPath, '.bojagi');
  if (!fs.existsSync(bojagiFolder)) {
    fs.mkdirSync(bojagiFolder);
  }

  fs.copyFileSync(
    path.resolve(__dirname, '../../../boilerplateDecorator.jsx'),
    path.join(bojagiFolder, 'decorator.js')
  );
}
