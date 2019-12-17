export function indentation(message: string) {
  return `  ${message}`;
}
export function emojiMessage(
  emoji: string,
  message: string,
  hasTopMargin: boolean = false,
  hasBottomMargin: boolean = true
) {
  const topMarginString = hasTopMargin ? '\n' : '';
  const bottomMarginString = hasBottomMargin ? '\n' : '';
  console.info(`${topMarginString}${indentation(`${emoji}   ${message}`)}${bottomMarginString}`);
}
