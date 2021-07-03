import envVar from 'env-var';

import { config } from './configEnv';

export * from 'env-var';

export function get(): { [varName: string]: string };
export function get(varName: string): envVar.IOptionalVariable;
export function get(varName?: string): { [varName: string]: string } | envVar.IOptionalVariable {
  config();

  return varName
    ? envVar.get(varName)
    : envVar.get();
}
