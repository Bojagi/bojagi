import axios from 'axios';
import { WriteStream } from 'fs';
import { getFS } from '../../dependencies';
import { CLIENT_FOLDER } from './constants';

import path = require('path');

const fs = getFS();

export async function downloadAndWriteClient(url, fileName): Promise<string> {
  const res = await axios.get(url, {
    responseType: 'stream',
  });
  const writer = fs.createWriteStream(path.join(CLIENT_FOLDER, fileName));
  writer.on('open', () => res.data.pipe(writer));
  await waitForWriter(writer);
  return res.headers.etag;
}

function waitForWriter(writer: WriteStream) {
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}
