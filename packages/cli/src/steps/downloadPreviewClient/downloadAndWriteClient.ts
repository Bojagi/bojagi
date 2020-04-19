import axios from 'axios';
import { WriteStream } from 'fs';
import { getFS } from '../../dependencies';
import { ZIP_PATH } from './constants';

const fs = getFS();

export async function downloadAndWriteClient(url): Promise<string> {
  const writer = fs.createWriteStream(ZIP_PATH);
  const res = await axios.get(url, {
    responseType: 'stream',
  });
  res.data.pipe(writer);
  await waitForWriter(writer);
  return res.headers.etag;
}

function waitForWriter(writer: WriteStream) {
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}
