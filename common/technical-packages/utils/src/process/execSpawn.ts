import { SpawnOptions } from 'child_process';

import { createSpawn } from './createSpawn';

export function execSpawn(command: string, options?: SpawnOptions): Promise<unknown>;
export function execSpawn(command: string, args?: ReadonlyArray<string>, options?: SpawnOptions): Promise<unknown>;

export async function execSpawn(command: any, options?: any): Promise<unknown> {
  const _options = {
    stdio: 'inherit',
    ...(options ?? {}),
  }
  const spawn = createSpawn('sh', ['-c', command], _options);
  return await spawn.promise;
}
