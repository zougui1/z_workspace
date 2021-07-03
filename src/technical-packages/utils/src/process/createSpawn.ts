import {
  spawn,
  StdioPipe,
  StdioNull,
  ChildProcessByStdio,
  SpawnOptionsWithoutStdio,
  ChildProcessWithoutNullStreams,
  SpawnOptionsWithStdioTuple,
  SpawnOptions,
  ChildProcess,
} from 'child_process';
import { Writable, Readable } from 'stream';

export function createSpawn(
  command: string,
  options?: SpawnOptionsWithoutStdio
): SpawnWrapper<ChildProcessWithoutNullStreams>;

export function createSpawn(
    command: string,
    options: SpawnOptionsWithStdioTuple<StdioPipe, StdioPipe, StdioPipe>,
): SpawnWrapper<ChildProcessByStdio<Writable, Readable, Readable>>;
export function createSpawn(
    command: string,
    options: SpawnOptionsWithStdioTuple<StdioPipe, StdioPipe, StdioNull>,
): SpawnWrapper<ChildProcessByStdio<Writable, Readable, null>>;
export function createSpawn(
    command: string,
    options: SpawnOptionsWithStdioTuple<StdioPipe, StdioNull, StdioPipe>,
): SpawnWrapper<ChildProcessByStdio<Writable, null, Readable>>;
export function createSpawn(
    command: string,
    options: SpawnOptionsWithStdioTuple<StdioNull, StdioPipe, StdioPipe>,
): SpawnWrapper<ChildProcessByStdio<null, Readable, Readable>>;
export function createSpawn(
    command: string,
    options: SpawnOptionsWithStdioTuple<StdioPipe, StdioNull, StdioNull>,
): SpawnWrapper<ChildProcessByStdio<Writable, null, null>>;
export function createSpawn(
    command: string,
    options: SpawnOptionsWithStdioTuple<StdioNull, StdioPipe, StdioNull>,
): SpawnWrapper<ChildProcessByStdio<null, Readable, null>>;
export function createSpawn(
    command: string,
    options: SpawnOptionsWithStdioTuple<StdioNull, StdioNull, StdioPipe>,
): SpawnWrapper<ChildProcessByStdio<null, null, Readable>>;
export function createSpawn(
    command: string,
    options: SpawnOptionsWithStdioTuple<StdioNull, StdioNull, StdioNull>,
): SpawnWrapper<ChildProcessByStdio<null, null, null>>;

export function createSpawn(command: string, options: SpawnOptions): SpawnWrapper<ChildProcess>;

// overloads of createSpawn with 'args'
export function createSpawn(
  command: string,
  args?: ReadonlyArray<string>,
  options?: SpawnOptionsWithoutStdio
): SpawnWrapper<ChildProcessWithoutNullStreams>;

export function createSpawn(
    command: string,
    args: ReadonlyArray<string>,
    options: SpawnOptionsWithStdioTuple<StdioPipe, StdioPipe, StdioPipe>,
): SpawnWrapper<ChildProcessByStdio<Writable, Readable, Readable>>;
export function createSpawn(
    command: string,
    args: ReadonlyArray<string>,
    options: SpawnOptionsWithStdioTuple<StdioPipe, StdioPipe, StdioNull>,
): SpawnWrapper<ChildProcessByStdio<Writable, Readable, null>>;
export function createSpawn(
    command: string,
    args: ReadonlyArray<string>,
    options: SpawnOptionsWithStdioTuple<StdioPipe, StdioNull, StdioPipe>,
): SpawnWrapper<ChildProcessByStdio<Writable, null, Readable>>;
export function createSpawn(
    command: string,
    args: ReadonlyArray<string>,
    options: SpawnOptionsWithStdioTuple<StdioNull, StdioPipe, StdioPipe>,
): SpawnWrapper<ChildProcessByStdio<null, Readable, Readable>>;
export function createSpawn(
    command: string,
    args: ReadonlyArray<string>,
    options: SpawnOptionsWithStdioTuple<StdioPipe, StdioNull, StdioNull>,
): SpawnWrapper<ChildProcessByStdio<Writable, null, null>>;
export function createSpawn(
    command: string,
    args: ReadonlyArray<string>,
    options: SpawnOptionsWithStdioTuple<StdioNull, StdioPipe, StdioNull>,
): SpawnWrapper<ChildProcessByStdio<null, Readable, null>>;
export function createSpawn(
    command: string,
    args: ReadonlyArray<string>,
    options: SpawnOptionsWithStdioTuple<StdioNull, StdioNull, StdioPipe>,
): SpawnWrapper<ChildProcessByStdio<null, null, Readable>>;
export function createSpawn(
    command: string,
    args: ReadonlyArray<string>,
    options: SpawnOptionsWithStdioTuple<StdioNull, StdioNull, StdioNull>,
): SpawnWrapper<ChildProcessByStdio<null, null, null>>;

export function createSpawn(
  command: string,
  args: ReadonlyArray<string>,
  options: SpawnOptions
): SpawnWrapper<ChildProcess>;

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
