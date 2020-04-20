import * as React from 'react';
import { collectStep } from '../steps/collect';
import { useConfig } from '../context/configContext';

export type UseCollectOutput = {
  done: boolean;
  message: string;
};

export function useCollect(): UseCollectOutput {
  const config = useConfig();
  const [error, setError] = React.useState();
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    collectStep.action({ config, stepOutputs: {} }).then(
      () => {
        setDone(true);
      },
      err => {
        setError(err);
      }
    );
  }, [config]);

  const message = getMessage({ done, error, messages: collectStep.messages });

  return {
    done,
    message,
  };
}

function getMessage({ done, error, messages }) {
  if (done) {
    return messages.success();
  }

  if (error) {
    return messages.error();
  }

  return messages.running();
}
