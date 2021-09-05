import path from 'path';
import fs from 'fs';

import env from '@zougui/env';

import { exportPublicEnvVars } from './exportPublicEnvVars';
import { AppTypes } from './AppTypes';

export const configureApp = (projectPath: string, options: ConfigureAppOptions = {}) => {
  const configuredEnv = env.config(projectPath, { preventProcessEnvOverride: true });

  const packageJsonPath = path.join(projectPath, 'package.json');
  const { name, version } = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')) || {};

  const processEnv = {
    ...(configuredEnv.parsed || {}),
    ...process.env,
    PUBLIC_npm_package_name: name,
    PUBLIC_npm_package_version: version,
  };

  const processedEnv = options.appType === AppTypes.react
    ? exportPublicEnvVars(processEnv)
    : processEnv;

  return {
    name,
    cwd: projectPath,
    script: 'npm',
    args: 'run start',
    // must be set to 'fork' to get all the logs
    exec_mode: 'fork',
    instances: 1,
    watch: false,
    env: {
      ...processedEnv,
      ...(options.env || {}),
    },
  };
}

export interface ConfigureAppOptions {
  appType?: AppTypes;
  env?: Record<string, string | number | boolean>;
}
