import childProcess from 'child_process';
import { EventEmitter } from 'events';

import { execSpawn } from './execSpawn';

describe('execSpawn()', () => {
  it('should execute the sub command as a sub-process and return its result', async () => {
    const message = 'my message';
    const subProcess = new EventEmitter();
    const spawn = jest.spyOn(childProcess, 'spawn')
      .mockName('child_process.spawn')
      .mockReturnValue(subProcess as any);

    const command = 'my command --my args';
    const options = { shell: 'my options' };

    const executingPromise = execSpawn(command, options);

    subProcess.emit('message', message);
    subProcess.emit('exit');

    expect(spawn).toHaveBeenCalledWith('sh', ['-c', command], { stdio: 'inherit', ...options });
    expect(await executingPromise).toBe(message);
  });

  it('should execute the sub command as a sub-process and reject', () => {
    const error = new Error('my error');
    const subProcess = new EventEmitter();

    const spawn = jest.spyOn(childProcess, 'spawn')
      .mockName('child_process.spawn')
      .mockReturnValue(subProcess as any);

    const command = 'my command --my args';
    const options = { shell: 'my options' };

    const executingPromise = execSpawn(command, options);

    subProcess.emit('error', error);

    expect(spawn).toHaveBeenCalledWith('sh', ['-c', command], { stdio: 'inherit', ...options });
    expect(executingPromise).toReject();
  });

  it('should resolve even when no options are provided', async () => {
    const message = 'my message';
    const subProcess = new EventEmitter();
    const spawn = jest.spyOn(childProcess, 'spawn')
      .mockName('child_process.spawn')
      .mockReturnValue(subProcess as any);

      const command = 'my command --my args';

    const executingPromise = execSpawn(command);

    subProcess.emit('message', message);
    subProcess.emit('exit');

    expect(spawn).toHaveBeenCalledWith('sh', ['-c', command], { stdio: 'inherit' });
    expect(await executingPromise).toBe(message);
  });
});
