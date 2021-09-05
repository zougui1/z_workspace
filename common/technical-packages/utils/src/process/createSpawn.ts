import { spawn, SpawnOptions, ChildProcess } from 'child_process';

export function createSpawn(command: string, options?: SpawnOptions): SpawnWrapper<ChildProcess>;
export function createSpawn(command: string, args?: ReadonlyArray<string>, options?: SpawnOptions): SpawnWrapper<ChildProcess>

export function createSpawn(command: any, args?: any, options?: any): SpawnWrapper<ChildProcess> {
  const process = spawn(command, args, options);
  const messages: string[] = [];

  process.on('message', (message) => {
    messages.push(message.toString());
  });
  const promise = new Promise((resolve, reject) => {
    process.once('exit', () => resolve(messages.join('\n')));
    process.once('error', reject);
  });

  return {
    process,
    promise,
  };
}

export interface SpawnWrapper<T extends ChildProcess> {
  process: T;
  promise: Promise<unknown>;
}
