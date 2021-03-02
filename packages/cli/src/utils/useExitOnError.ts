import { useEffect } from 'react';

export function useExitOnError(error: any) {
  useEffect(() => {
    if (error) {
      setTimeout(() => process.exit(1));
    }
  }, [error]);
}
