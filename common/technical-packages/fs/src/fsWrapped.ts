import fs, { EnsureOptions, WriteFileOptions } from 'fs-extra';

import { fsErrorWrapper } from './fsErrorWrapper';

export function readFile(file: string, options: { flag?: string | undefined; } | { encoding: string; flag?: string | undefined; }): Promise<string>;
export function readFile(file: string, encoding: string): Promise<string>;
export function readFile(file: string): Promise<Buffer>;
export function readFile(file: string, ...args: any[]): Promise<any> {
  return fsErrorWrapper(fs.readFile)(file, ...args);
}

export const writeFile = async (file: string, data: any, options?: WriteFileOptions | string): Promise<void> => {
  return fsErrorWrapper<void>(fs.writeFile)(file, data, options);
}

export const openDir = async (path: string, options?: fs.OpenDirOptions): Promise<fs.Dir> => {
  return fsErrorWrapper(fs.opendir)(path, options);
}

export function readdir(path: string, options?: { encoding: BufferEncoding | null; withFileTypes?: false | undefined } | BufferEncoding | null): Promise<string[]>;
export function readdir(path: string, options: 'buffer' | { encoding: 'buffer'; withFileTypes?: false | undefined }): Promise<Buffer[]>;
export function readdir(path: string, options?: { encoding?: string | null | undefined; withFileTypes?: false | undefined }): Promise<string[] | Buffer[]>;
export function readdir(path: string, options: { encoding?: string | null | undefined; withFileTypes: true }): Promise<fs.Dirent[]>;
export function readdir(path: string, ...args: any[]): Promise<string[] | Buffer[] | fs.Dirent[]> {
  return fsErrorWrapper(fs.readdir)(path, ...args);
}

export const ensureDir = (path: string, options?: EnsureOptions | number): Promise<void> => {
  return fsErrorWrapper<void>(fs.ensureDir)(path, options);
}
