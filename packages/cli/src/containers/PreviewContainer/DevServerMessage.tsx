import * as React from 'react';
import { Box, Color } from 'ink';
import Spinner from 'ink-spinner';
import { Message } from '../../components/Message';

export function DevServerMessage({ foundComponents, devServer, established, ready, errors }) {
  if (!foundComponents || !devServer) {
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
        <Color red>Following compile errors happened:</Color>
        {errors.map(err => (
          <Box key={err.message}>{err.message}</Box>
        ))}
      </Box>
    );
  }
  return <Message emoji="chicken">Bojagi Preview server started</Message>;
}
