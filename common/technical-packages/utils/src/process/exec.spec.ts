import childProcess from 'child_process';
import { BaseEncodingOptions } from 'fs';

import { exec } from './exec';

describe('exec()', () => {

  let childProcessExec: jest.SpyInstance<childProcess.ChildProcess, [command: string, options: (BaseEncodingOptions & childProcess.ExecOptions) | null | undefined, callback?: ((error: childProcess.ExecException | null, stdout: string | Buffer, stderr: string | Buffer) => void) | undefined]>;

  beforeEach(() => {
    childProcessExec = jest.spyOn(childProcess, 'exec').mockName('child_process.exec');
  });

  afterEach(() => {
    childProcessExec.mockRestore();
  });

  it('should execute the command and resolve', async () => {
    const message = 'my message';

    // @ts-ignore
    childProcessExec.mockImplementation((command: string, options: any, callback: (err: any, result: string) => void): void => {
      callback(null, message);
    });

    const command = 'my command --my args';
    const options = { shell: 'my options' };

    const executingPromise = exec(command, options);

    expect(await executingPromise).toBe(message);
  });

  it('should execute the command and resolve', async () => {
    // @ts-ignore
    childProcessExec.mockImplementation((command: string, options: any, callback: (err: any, result?: string) => void): void => {
      callback('error');
    });

    const command = 'my command --my args';
    const options = { shell: 'my options' };

    const executingPromise = exec(command, options);

    expect(executingPromise).toReject();
  });
});
