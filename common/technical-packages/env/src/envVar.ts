import envVar from 'env-var';
import isBrowser from 'is-browser';

import { config } from './configEnv';

export * from 'env-var';

export function get(): { [varName: string]: string };
export function get(varName: string): envVar.IOptionalVariable;
export function get(varName?: string): { [varName: string]: string } | envVar.IOptionalVariable {
  if (!isBrowser) {
    config();
  }

  return varName
    ? envVar.get(getPublicVarName(varName))
    : envVar.get();
}

const getPublicVarName = (varName: string): string => {
  const publicVarName = `PUBLIC_${varName}`;
  const reactAppVarName = `REACT_APP_${varName}`;

  if (varName in process.env) {
    return varName;
  }

  if (publicVarName in process.env) {
    return publicVarName;
  }

  if (reactAppVarName in process.env) {
    return reactAppVarName;
  }

  return varName;
}
