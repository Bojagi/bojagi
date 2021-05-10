import * as path from 'path';
import { getFS } from '../dependencies';

const fs = getFS();

export async function copyStaticFiles(
  folders: string[],
  outputPath: string,
  subPath: string = ''
): Promise<string[]> {
  return Promise.all(
    folders.filter(fs.existsSync).map(async folder => {
      const folderFiles = await fs.promises.readdir(path.join(folder, subPath));
      return Promise.all(
        folderFiles.map(async folderFile => {
          const relativePath = path.join(subPath, folderFile);
          const fullPath = path.join(folder, relativePath);
          const fullOutputPath = path.join(outputPath, relativePath);
          const stats = await fs.promises.stat(fullPath);

          if (stats.isDirectory()) {
            await fs.promises.mkdir(fullOutputPath);
            return copyStaticFiles([folder], outputPath, relativePath);
          }
          await fs.promises.copyFile(fullPath, fullOutputPath);
          return [relativePath];
        })
      ).then(files => files.flat());
    })
  ).then(files => files.flat());
}
