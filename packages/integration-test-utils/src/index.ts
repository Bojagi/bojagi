import { chromium } from 'playwright-chromium';
import * as Differencify from 'differencify';
import fetch from 'node-fetch';

const URL = 'http://localhost:5002';
const API_URL = `${URL}/api`;
const differencify = new Differencify({});

export async function snapshotPreview() {
  const stories = await getStories();
  const browser = await chromium.launch();

  await Promise.all(stories.map(story => snapshotStory(browser, story)));

  await browser.close();

  // await stories.reduce(async (prev, story)=> {

  //   await prev
  //   snapshotStory(story)
  // }, Promise.resolve())

  return stories;
}

async function getStories() {
  const response = await fetch(`${API_URL}/stories`);
  if (response.ok) {
    const res = await response.json();
    return res.stories;
  }
  throw new Error('could not fetch stories from api');
}

async function snapshotStory(_browser, story) {
  const target = differencify.init({ chain: false });
  await target.launch();
  const page = await target.newPage();
  // await page.setViewport({ width: 1600, height: 1200 });
  await page.goto(`${URL}/app/story/${toB64(story.filePath)}`);
  await page.waitForSelector('iframe');
  const element = await page.$('iframe');
  await page.waitFor(3000);
  const image = await element.screenshot({ path: `${story.filePath}.png` });
  const result = await target.toMatchSnapshot(image);
  await page.close();
  await target.close();
  return result;
}

function toB64(str) {
  return Buffer.from(str).toString('base64');
}
