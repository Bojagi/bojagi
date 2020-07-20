import * as React from 'react';
import { render } from 'ink';
import { InitContainer } from '../containers/InitContainer';
import { ConfigProvider } from '../config/configContext';

import program = require('commander');

program
  .command('init')
  .description('Initialise your project')
  .action(() => {
    render(
      <ConfigProvider config={{}}>
        <InitContainer />
      </ConfigProvider>
    );
  });
