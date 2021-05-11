import * as path from 'path';
import { getFS } from '../dependencies';

const fs = getFS();

async function copyStaticFilesFromFolder(folder: string, outputPath: string, subPath: string = '') {
  const folderFiles = await fs.promises.readdir(path.join(folder, subPath));
  return Promise.all(
    folderFiles.map(async folderFile => {
      const relativePath = path.join(subPath, folderFile);
      const fullPath = path.join(folder, relativePath);
      const fullOutputPath = path.join(outputPath, relativePath);
      const stats = await fs.promises.stat(fullPath);

      if (stats.isDirectory()) {
        await fs.promises.mkdir(fullOutputPath);
        return copyStaticFilesFromFolder(folder, outputPath, relativePath);
      }
      await fs.promises.copyFile(fullPath, fullOutputPath);
      return [relativePath];
    })
  ).then(files => files.flat());
}

export async function copyStaticFiles(folders: string[], outputPath: string): Promise<string[]> {
  return Promise.all(
    folders.filter(fs.existsSync).map(folder => copyStaticFilesFromFolder(folder, outputPath))
  ).then(files => files.flat());
}
