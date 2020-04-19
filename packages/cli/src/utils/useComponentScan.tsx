import * as React from 'react';
import { useConfig } from '../context/configContext';
import { ScanStepOutput, scanStep } from '../steps/scan';
import { Message } from '../components/Message';

export function useComponentScan(): Partial<ScanStepOutput> & {
  getCurrentMessage: () => React.ReactNode;
} {
  const config = useConfig();
  const [scanOutput, setScanOutput] = React.useState<ScanStepOutput>();

  React.useEffect(() => {
    scanStep.action({ config, stepOutputs: {} }).then(output => {
      setScanOutput(output);
    });
  }, [config]);

  const getCurrentMessage = React.useCallback(() => {
    let message;
    if (scanOutput) {
      message = scanStep.messages.success(scanOutput);
    } else {
      message = scanStep.messages.running();
    }
    return <Message emoji={scanStep.emoji}>{message}</Message>;
  }, [scanOutput]);

  return React.useMemo(
    () => ({
      ...scanOutput,
      getCurrentMessage,
    }),
    [scanOutput, getCurrentMessage]
  );
}
