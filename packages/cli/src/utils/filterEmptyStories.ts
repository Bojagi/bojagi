export function filterEmptyStories(story) {
  return !!story.storyItems && story.storyItems.length;
}
