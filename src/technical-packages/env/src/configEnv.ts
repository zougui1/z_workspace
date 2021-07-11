import path from 'path';
import dotenv from 'dotenv';

import { ROOT, WORKSPACE_ROOT_PATH } from './constants';

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

  const workspaceRootCommonEnvPath = path.join(WORKSPACE_ROOT_PATH, fileName);
  const workspaceRootEnvPath = path.join(WORKSPACE_ROOT_PATH, envFileName);

  // dotenv do not override existing env variables
  // which means the first to be set is the one to be used

  // read the dotenv files at the project level
  dotenv.config({ path: envPath });
  dotenv.config({ path: commonEnvPath });

  // read the dotenv files at the root of the monorepo
  dotenv.config({ path: workspaceRootEnvPath });
  dotenv.config({ path: workspaceRootCommonEnvPath });
}
