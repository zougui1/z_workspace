import childProcess from 'child_process';
import { EventEmitter } from 'events';

import { createSpawn } from './createSpawn';

describe('createSpawn()', () => {

  let subProcess: EventEmitter;
  let spawn: jest.SpyInstance<childProcess.ChildProcess, [command: string, args: readonly string[], options: childProcess.SpawnOptions]>;

  beforeEach(() => {
    subProcess = new EventEmitter();
    spawn = jest.spyOn(childProcess, 'spawn')
      .mockName('child_process.spawn')
      .mockReturnValue(subProcess as any);
  });

  afterEach(() => {
    spawn.mockRestore();
  });

  it('should return the spawned process', async () => {
    const message = 'my message';

    const command = 'my command';
    const args = ['my', 'args'];
    const options = { shell: 'my options' };

    const { process, promise } = createSpawn(command, args, options);

    subProcess.emit('message', message);
    subProcess.emit('exit');

    expect(spawn).toHaveBeenCalledWith(command, args, options);
    expect(process).toEqual(subProcess);
    expect(await promise).toBe(message);
  });

  it('should return a promise that rejects when the process gives out an error', () => {
    const error = new Error('my error');

    const command = 'my command';
    const args = ['my', 'args'];
    const options = { shell: 'my options' };

    const { promise } = createSpawn(command, args, options);

    subProcess.emit('error', error);

    expect(spawn).toHaveBeenCalledWith(command, args, options);
    expect(promise).toReject();
  });
});
