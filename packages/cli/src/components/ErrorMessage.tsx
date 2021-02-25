/* eslint-disable no-empty-function */
import * as React from 'react';
import { Box, Text } from 'ink';
import { Message } from './Message';
import { NonVerboseError } from '../errors';

export type ErrorLike = {
  message: string;
  stack?: string;
};

export class SimpleError implements ErrorLike {
  // eslint-disable-next-line no-useless-constructor
  constructor(public message: string, public stack?: string) {}
}

export type ErrorMessageProps = {
  error: Error | NonVerboseError | ErrorLike;
};

export function ErrorMessage({ error }: ErrorMessageProps) {
  return (
    <Box flexDirection="column">
      <Message emoji="x">Error: {error.message}</Message>
      {!!error.stack && !(error as NonVerboseError).hideStackTrace && (
        <Box marginX={3} marginBottom={1}>
          <Text color="red">{error.stack}</Text>
        </Box>
      )}
    </Box>
  );
}
