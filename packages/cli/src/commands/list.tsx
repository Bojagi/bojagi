import * as React from 'react';
import { render } from 'ink';
import { ListContainer } from '../containers/ListContainer';
import { ConfigProvider } from '../context/configContext';
import { getConfig } from '../config';

import program = require('commander');

program
  .command('list')
  .option('-d, --dir [dir]', 'The root folder to search components in')
  .description('lists components that are extracted')
  .action(() => {
    render(
      <ConfigProvider config={getConfig()}>
        <ListContainer />
      </ConfigProvider>
    );
  });
