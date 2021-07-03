import path from 'path';
import dotenv from 'dotenv';

import { ROOT } from './constants';

let configured = false;

export const config = (configDir: string = ROOT) => {
  if (configured) {
    return;
  }

  configured = true;
  const { NODE_ENV } = process.env;
  const fileName = '.env';
  const suffix = NODE_ENV || 'development';

  const envFileName = `${fileName}.${suffix}`;
  const commonEnvPath = path.join(configDir, fileName);
  const envPath = path.join(configDir, envFileName);

  dotenv.config({ path: envPath });
  dotenv.config({ path: commonEnvPath });
}
