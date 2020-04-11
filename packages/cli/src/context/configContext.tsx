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
  const config = {
    ...getConfig(),
    ...customConfig,
  };
  return <Provider value={config}>{children}</Provider>;
}
