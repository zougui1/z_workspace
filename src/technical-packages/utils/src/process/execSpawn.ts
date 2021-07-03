import { StdioPipe, StdioNull, SpawnOptionsWithoutStdio, SpawnOptionsWithStdioTuple, SpawnOptions } from 'child_process';

import { createSpawn } from './createSpawn';

export function execSpawn(
  command: string,
  options?: SpawnOptionsWithoutStdio
): Promise<unknown>;

export function execSpawn(
    command: string,
    options: SpawnOptionsWithStdioTuple<StdioPipe, StdioPipe, StdioPipe>,
): Promise<unknown>;
export function execSpawn(
    command: string,
    options: SpawnOptionsWithStdioTuple<StdioPipe, StdioPipe, StdioNull>,
): Promise<unknown>;
export function execSpawn(
    command: string,
    options: SpawnOptionsWithStdioTuple<StdioPipe, StdioNull, StdioPipe>,
): Promise<unknown>;
export function execSpawn(
    command: string,
    options: SpawnOptionsWithStdioTuple<StdioNull, StdioPipe, StdioPipe>,
): Promise<unknown>;
export function execSpawn(
    command: string,
    options: SpawnOptionsWithStdioTuple<StdioPipe, StdioNull, StdioNull>,
): Promise<unknown>;
export function execSpawn(
    command: string,
    options: SpawnOptionsWithStdioTuple<StdioNull, StdioPipe, StdioNull>,
): Promise<unknown>;
export function execSpawn(
    command: string,
    options: SpawnOptionsWithStdioTuple<StdioNull, StdioNull, StdioPipe>,
): Promise<unknown>;
export function execSpawn(
    command: string,
    options: SpawnOptionsWithStdioTuple<StdioNull, StdioNull, StdioNull>,
): Promise<unknown>;

export function execSpawn(command: string, otions: SpawnOptions): Promise<unknown>;

export async function execSpawn(command: any, options?: any): Promise<unknown> {
  const _options = {
    stdio: 'inherit',
    ...(options ?? {}),
  }
  const spawn = createSpawn('sh', ['-c', command], _options);
  return await spawn.promise;
}
