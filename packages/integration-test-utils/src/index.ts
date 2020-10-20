import { chromium } from 'playwright-chromium';
import fetch from 'node-fetch';

const URL = 'http://localhost:5002';
const API_URL = `${URL}/api`;

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

async function snapshotStory(browser, story) {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(`${URL}/app/story/${toB64(story.filePath)}`);
  await new Promise(resolve => setTimeout(resolve, 3000));
  const element = await page.$('iframe');
  await element.screenshot({ path: `${story.filePath}.png` });
}

function toB64(str) {
  return Buffer.from(str).toString('base64');
}
