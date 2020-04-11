import * as React from 'react';
import { Box } from 'ink';
import { Emoji, EmojiCode } from './Emoji';

export type MessageProps = {
  emoji: EmojiCode;
  children: React.ReactNode;
};

export function Message({ children, emoji }: MessageProps) {
  return (
    <Box marginX={3} marginBottom={1}>
      <Emoji code={emoji} marginRight={1} />
      <Box flexGrow={1}>{children}</Box>
    </Box>
  );
}
