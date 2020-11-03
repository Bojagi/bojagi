import * as path from 'path';
import * as cp from 'child_process';
import fetch from 'node-fetch';
import { API_URL, MAX_BUILD_TIME } from './constants';

type StartPreviewResponse = {
  stories: object;
  previewProcess: cp.ChildProcess;
};

export async function startPreview(cwd, options?: cp.SpawnOptionsWithoutStdio) {
  const bojagiBin = path.resolve(cwd, 'node_modules', '.bin', 'bojagi');

  const previewProcess = cp.spawn(bojagiBin, ['preview', '--noOpen'], {
    stdio: ['inherit', 'inherit', process.stderr],
    cwd,
    env: { ...process.env, CI: 'true' },
    ...options,
  });
  return new Promise<StartPreviewResponse>((resolve, reject) => {
    let interval;
    const maxTimeout = setTimeout(() => {
      console.log('max timeout reached, rejecting');
      clearInterval(interval);
      previewProcess.kill();
      reject(new Error('preview server took to long to start'));
    }, MAX_BUILD_TIME);
    interval = setInterval(async () => {
      try {
        const stories = await getPreviewStories();
        console.log('clearing interval');
        clearInterval(interval);
        console.log('clearing timeout');
        clearTimeout(maxTimeout);
        resolve({ stories, previewProcess });
      } catch (e) {
        console.log('preview not up yet, waiting....');
      }
    }, 1000);
  });
}

export async function getPreviewStories() {
  const response = await fetch(`${API_URL}/stories`);
  if (response.ok) {
    const res = await response.json();
    return res.stories;
  }
  console.log(await response.text());
  throw new Error('could not fetch stories from api');
}
