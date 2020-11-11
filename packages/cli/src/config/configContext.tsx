import { Box } from 'ink';
import * as React from 'react';
import { getConfig, Config } from '.';
import { ErrorMessage } from '../components/ErrorMessage';

export const configContext = React.createContext<Config>(undefined as any);

export function useConfig() {
  return React.useContext(configContext);
}

export type ConfigProviderProps = {
  config: Partial<Config>;
  children: React.ReactNode;
};

export function ConfigProvider({ config: customConfig, children }: ConfigProviderProps) {
  const { Provider } = configContext;
  const [config, setConfig] = React.useState<Config | undefined>();
  const [err, setError] = React.useState<Error | undefined>();
  React.useEffect(() => {
    const configWithoutUndefined = removeUndefinedFromObject(customConfig);
    getConfig(configWithoutUndefined)
      .then(cfg => {
        setConfig(cfg);
      })
      .catch(error => {
        setError(error);
        process.exitCode = 1;
      });
  }, [customConfig]);

  if (err) {
    return (
      <Box marginTop={1}>
        <ErrorMessage error={err} />
      </Box>
    );
  }

  if (!config) {
    return null;
  }

  return <Provider value={config}>{children}</Provider>;
}

function removeUndefinedFromObject<T extends Record<any, any>>(obj: T) {
  return Object.entries(obj)
    .filter(([_, value]) => value !== undefined)
    .reduce<Partial<T>>(
      (acc, [key, value]) => ({
        ...acc,
        [key]: value,
      }),
      {}
    );
}
