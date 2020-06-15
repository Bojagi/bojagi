import * as React from 'react';
import { getConfig, Config } from '.';

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
  React.useEffect(() => {
    const configWithoutUndefined = removeUndefinedFromObject(customConfig);
    getConfig(configWithoutUndefined).then(cfg => {
      setConfig(cfg);
    });
  }, [customConfig]);

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
