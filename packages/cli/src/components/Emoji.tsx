import * as React from 'react';
import { Box } from 'ink';
import * as nodeEmoji from 'node-emoji';

export type EmojiCode = keyof typeof nodeEmoji.emoji | 'woman-shrugging';

export type EmojiProps = {
  marginRight?: number;
  code: EmojiCode;
};

export function Emoji({ code, marginRight = 0 }: EmojiProps) {
  const emoji = nodeEmoji.get(code);

  return (
    <Box marginRight={marginRight} width={getEmojiWidth(code, emoji)}>
      {emoji}
    </Box>
  );
}

function getEmojiWidth(code: EmojiCode, emoji: string) {
  switch (code) {
    case 'warning' as any:
      return 3;
    case 'woman_in_lotus_position' as any:
      return 4;
    case 'x':
      return 2;
    case 'pencil2':
      return 4;
    case 'chipmunk':
      return 4;
    default:
      return emoji.length;
  }
}
