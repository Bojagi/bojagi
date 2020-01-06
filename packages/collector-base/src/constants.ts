import * as path from 'path';

export const EXECUTION_PATH = process.cwd();
export const BOJAGI_FOLDER = path.join(EXECUTION_PATH, '.bojagi');
export const TEMP_FOLDER = path.join(EXECUTION_PATH, '.bojagi', 'tmp');
