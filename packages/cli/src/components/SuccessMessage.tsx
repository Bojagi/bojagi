import * as React from 'react';
import { Color } from 'ink';
import { Message } from './Message';

export type SuccessMessageProps = {
  runtime?: number;
};

export function SuccessMessage({ runtime }: SuccessMessageProps) {
  return (
    <Message emoji="raised_hands">
      We're done! Have a nice day! {runtime && <Color gray>Done in {runtime} seconds.</Color>}
    </Message>
  );
}
