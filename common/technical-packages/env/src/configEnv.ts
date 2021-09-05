import path from 'path';
import fsExtra from 'fs-extra';
import isBrowser from 'is-browser';

import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

import { ROOT, WORKSPACE_ROOT_PATH } from './constants';

let configured: DotenvResult | undefined;
const fileName = '.env';

const getWorkspaceDirs = (dir: string): string[] => {
  const dirs: string[] = [];
  let currentDir: string | undefined = dir;

  const fs: typeof fsExtra = require('fs-extra');

  while (currentDir) {
    const node = fs.statSync(currentDir);
    const isDir = node.isDirectory();

    if (isDir) {
      const packageFile = path.join(currentDir, 'package.json');

      if (fs.pathExistsSync(packageFile)) {
        const packageContent = fs.readFileSync(packageFile, 'utf8');
        const packageJson = JSON.parse(packageContent);

        dirs.push(currentDir);

        if (packageJson.env?.root) {
          currentDir = undefined;
          break;
        }
      }
    }

    const parentDir = path.dirname(currentDir);

    if(parentDir === currentDir) {
      currentDir = undefined;
    } else {
      dirs.push(...getWorkspaceDirs(parentDir));
      currentDir = parentDir;
    }
  }

  return Array.from(new Set(dirs));
}

const getEnvFileName = (): string => {
  const { NODE_ENV } = process.env;
  const suffix = NODE_ENV || 'development';

  return `${fileName}.${suffix}`;
}

export const config = (configDir: string = ROOT, options?: EnvConfigOptions): DotenvResult => {
  if (isBrowser) {
    return { parsed: {} };
  }

  if (configured) {
    return configured;
  }

  // get a copy of the env
  const env = { ...process.env };
  const configDirs = getWorkspaceDirs(configDir);
  const envFiles = configDirs.flatMap(getDirEnvsPaths);

  // dotenv do not override existing env variables
  // which means the first to be set is the one to be used

  const envVars = configured ??= configurePaths(envFiles);

  if (options?.preventProcessEnvOverride) {
    // restore `process.env` like it was before the configuration
    // of the env files
    process.env = env;
  }

  return envVars;
}

const getDirEnvsPaths = (dir: string): string[] => {
  const envFileName = getEnvFileName();
  const commonEnvPath = path.resolve(WORKSPACE_ROOT_PATH, dir, fileName);
  const envPath = path.resolve(WORKSPACE_ROOT_PATH, dir, envFileName);

  return [envPath, commonEnvPath];
}

const configPath = (path: string) => {
  return dotenvExpand(dotenv.config({ path }));
}

const configurePaths = (paths: string[]): DotenvResult => {
  const envs = paths.map(path => configPath(path));
  const erroredEnv = envs.find(env => env.error && (env.error as any).code !== 'ENOENT');

  if (erroredEnv) {
    return {
      error: erroredEnv.error,
      parsed: {},
    };
  }

  const parsedEnvs = envs.filter(env => env.parsed).map(env => env.parsed);
  const finalEnv = parsedEnvs.reduce((finalEnv, currentEnv) => {
    return {
      ...currentEnv,
      ...finalEnv,
    };
  }, {} as DotenvResult['parsed']);

  return { parsed: finalEnv || {} };
}

export type DotenvResult = {
  error?: Error;
  parsed: { [name: string]: string };
}

export interface EnvConfigOptions {
  preventProcessEnvOverride?: boolean;
}
