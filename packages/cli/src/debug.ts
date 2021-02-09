import debug from 'debug';

const baseDebug = debug('bojagi');

export enum DebugNamespaces {
  ANALYZE = 'analyze',
  CLEAN_UP = 'cleanup',
  COMPILE = 'compile',
  PREVIEW = 'preview',
  SCAN = 'scan',
  STORYBOOK = 'storybook',
  UPLOAD = 'upload',
  VALIDATE = 'validate',
  WEBPACK_CONFIG = 'webpackConfig',
}

const debuggers = Object.values(DebugNamespaces).reduce(
  (ds, value) => ({ ...ds, [value]: baseDebug.extend(value) }),
  {}
);

export default debuggers;
