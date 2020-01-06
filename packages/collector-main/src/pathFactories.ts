import * as pathUtil from 'path';

export const getBasePath = (executionPath: string) => `${executionPath}/.bojagi/tmp/collector/main`;

export const getMocksPath = (executionPath: string, suffix: string = '.') =>
  pathUtil.join(getBasePath(executionPath), 'mocks', suffix);

export const getOutputPath = (executionPath: string, suffix: string = '.') =>
  pathUtil.join(getBasePath(executionPath), 'output', suffix);
