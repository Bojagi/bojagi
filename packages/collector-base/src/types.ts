// eslint-disable-next-line import/no-extraneous-dependencies
import * as webpack from 'webpack';
import { ComponentWithMetadata } from '@bojagi/types';

export type CollectorMetadata = {
  name: string;
};

export type CollectorFunctionOptions = {
  webpack: typeof webpack;
  executionPath: string;
  components: ComponentWithMetadata[];
};

export type CollectorFunction = (options: CollectorFunctionOptions) => Promise<void> | void;
