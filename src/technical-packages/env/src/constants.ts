import path from 'path';

export const ROOT = require.main?.filename
  ? path.dirname(path.dirname(require.main.filename))
  : process.cwd();
