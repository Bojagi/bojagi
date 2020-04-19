import * as React from 'react';
import { Box, Color } from 'ink';
import { Message } from './Message';
import { NonVerboseError } from '../errors';

export type ErrorMessageProps = {
  error: Error | NonVerboseError;
};

export function ErrorMessage({ error }: ErrorMessageProps) {
  return (
    <Box flexDirection="column">
      <Message emoji="x">Error: {error.message}</Message>
      {!(error as NonVerboseError).hideStackTrace && (
        <Box marginX={3} marginBottom={1}>
          <Color red>{error.stack}</Color>
        </Box>
      )}
    </Box>
  );
}
