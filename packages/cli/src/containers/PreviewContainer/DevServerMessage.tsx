import * as React from 'react';
import { Box, Text, Newline } from 'ink';
import Spinner from 'ink-spinner';
import { Message } from '../../components/Message';

export function DevServerMessage({
  storyFiles,
  devServer,
  established,
  ready,
  errors,
  setupError,
}) {
  if (setupError) {
    return (
      <Box marginX={3} marginBottom={1}>
        <Text>
          <Text color="red">Something went wrong:</Text>
          <Newline />
          {setupError.message}
          <Newline />
          {setupError.stack}
        </Text>
      </Box>
    );
  }
  if (!storyFiles || !devServer) {
    return null;
  }
  if (!established) {
    return (
      <Message emoji="hatching_chick">
        Starting Bojagi Preview <Spinner type="dots3" />
      </Message>
    );
  }
  if (!ready) {
    return (
      <Message emoji="hatching_chick">
        Bundling <Spinner type="dots3" />
      </Message>
    );
  }
  if (errors.length > 0) {
    return (
      <Box marginX={3} marginBottom={1} flexDirection="column">
        <Text color="red">Following compile errors happened:</Text>
        {errors.map(err => (
          <Box key={err.message}>
            <Text>{err.message}</Text>
          </Box>
        ))}
      </Box>
    );
  }
  return <Message emoji="chicken">Bojagi Preview server started</Message>;
}
