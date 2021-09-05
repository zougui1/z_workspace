import path from 'path';
import isBrowser from 'is-browser';

import findPackageJson, { PackageWithPath } from 'find-package-json';
import StackTracey from 'stacktracey';

import { iterateAll } from '@zougui/utils';

const cache: Record<string, Package> = {};

export const getScope = (file: string): Package => {
  if (isBrowser) {
    return undefined as any;
  }

  if (cache[file]) {
    return cache[file];
  }

  const packages = iterateAll(findPackageJson(file)).filter(pkg => pkg) as Package[];
  cache[file] = packages[0];

  packages[0].name ??= path.basename(path.dirname(packages[0].__path));

  return packages[0];
}

export const currentScope = (options: { limit?: number; offset?: number; } = {}): Package => {
  const originalStackTraceLimit = Error.stackTraceLimit;
  Error.stackTraceLimit = options.limit ?? originalStackTraceLimit;
  const stack = new StackTracey(new Error(), options.offset);
  Error.stackTraceLimit = originalStackTraceLimit;


  return getScope(stack.at(0).file);
}

export type Package = PackageWithPath & { name: string };
