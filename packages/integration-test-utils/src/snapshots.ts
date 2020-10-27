import * as Differencify from 'differencify';

const URL = 'http://localhost:5002';
const differencify = new Differencify({});

export async function snapshotPreview(stories) {
  const target = differencify.init({ chain: false });
  await target.launch({ headless: false });
  try {
    await stories.reduce(async (prev, story) => {
      console.log('snapshot story', story);
      await prev;
      console.log('here we go');
      return snapshotStory(target, story);
    }, Promise.resolve());
    target.close();
    return stories;
  } catch (e) {
    target.close();
    throw e;
  }
}

async function snapshotStory(target, story) {
  const page = await target.newPage();
  // await page.setViewport({ width: 1600, height: 1200 });
  await page.goto(`${URL}/app/story/${toB64(story.filePath)}`);
  console.log('wait for ifram');
  await page.waitForSelector('iframe');
  console.log('getting element');
  const element = await page.$('iframe');
  console.log('wait for 3');
  await page.waitFor(3000);
  console.log('take screnshot');
  const image = await element.screenshot({ path: `${toB64(story.filePath)}.png` });
  console.log('compare screenshot');
  await target.toMatchSnapshot(image);
  console.log('done with story', story);
}

function toB64(str) {
  return Buffer.from(str).toString('base64');
}
