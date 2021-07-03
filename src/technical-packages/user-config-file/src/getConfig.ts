import { ObjectSchema } from 'joi';

import { readConfig } from './readConfig';
import { validateConfig } from './validateConfig';
import { CONFIG_PATH } from './constants';

export async function getConfig<T>(options: GetNormalizedConfigOptions<T>): Promise<T>;
export async function getConfig(options: GetConfigOptions): Promise<unknown>;
export async function getConfig<T = unknown>(options: GetConfigOptions | GetNormalizedConfigOptions<T>): Promise<T | unknown> {
  const file = options.file ?? CONFIG_PATH;
  const dirtyConfig = await readConfig(file);
  const rawConfig = validateConfig(dirtyConfig, options.schema);
  const config = 'normalize' in options ? options.normalize(rawConfig) : rawConfig;

  return config;
}

export interface GetConfigOptions {
  file?: string;
  schema: ObjectSchema;
}

export interface GetNormalizedConfigOptions<T> {
  file?: string;
  schema: ObjectSchema;
  normalize: (rawConfig: unknown) => T | Promise<T>;
}
