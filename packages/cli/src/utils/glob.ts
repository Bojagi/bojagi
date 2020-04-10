import { promisify } from 'util';

import glob = require('glob');

export default promisify(glob);
