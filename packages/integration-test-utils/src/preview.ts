// import * as fs from 'fs';
import * as path from 'path';
import * as cp from 'child_process';
import fetch from 'node-fetch';

const URL = 'http://localhost:5002';
const API_URL = `${URL}/api`;

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
  return new Promise<StartPreviewResponse>(resolve => {
    const interval = setInterval(async () => {
      try {
        const stories = await getPreviewStories();
        clearInterval(interval);
        resolve({ previewProcess, stories });
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
  throw new Error('could not fetch stories from api');
}
