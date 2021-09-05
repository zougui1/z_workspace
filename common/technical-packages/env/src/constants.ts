import path from 'path';

const mainFile = require.main?.filename
  ? path.dirname(path.dirname(require.main.filename))
  : '';

export const ROOT = mainFile && !mainFile.includes('/node/')
  ? mainFile.includes('node_modules')
    ? mainFile.replace(/\/node_modules\/.*/, '')
    : mainFile
  : process.cwd();

export const WORKSPACE_ROOT_PATH = path.join(__dirname, '../../../..');
