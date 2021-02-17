import * as React from 'react';
import { Text } from 'ink';
import { Message } from './Message';

export type SuccessMessageProps = {
  runtime?: number;
};

export function SuccessMessage({ runtime }: SuccessMessageProps) {
  return (
    <Message emoji="raised_hands">
      We're done! Have a nice day! {runtime && <Text color="gray">Done in {runtime} seconds.</Text>}
    </Message>
  );
}
