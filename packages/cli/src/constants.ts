import * as path from 'path';

export const EXECUTION_PATH = process.cwd();
export const BOJAGI_FOLDER = path.join(EXECUTION_PATH, '.bojagi');
export const TEMP_FOLDER = path.join(BOJAGI_FOLDER, 'tmp');
export const PREVIEW_CLIENT_FOLDER = path.join(TEMP_FOLDER, 'preview-client');
export const PREVIEW_CLIENT_OUTPUT_FOLDER = path.join(PREVIEW_CLIENT_FOLDER, 'local-dev-latest');
export const PREVIEW_CLIENT_VERSION = '0.1';
export const MANIFEST_VERSION = '3';
