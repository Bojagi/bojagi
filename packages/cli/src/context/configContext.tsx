import * as React from 'react';
import { Config, getConfig } from '../config';

export const configContext = React.createContext<Config>(getConfig());

export function useConfig() {
  return React.useContext(configContext);
}

export type ConfigProviderProps = {
  config: Partial<Config>;
  children: React.ReactNode;
};

export function ConfigProvider({ config: customConfig, children }: ConfigProviderProps) {
  const { Provider } = configContext;
  const configWithoutUndefined = removeUndefinedFromObject(customConfig);
  const config = {
    ...getConfig(),
    ...configWithoutUndefined,
  };
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
