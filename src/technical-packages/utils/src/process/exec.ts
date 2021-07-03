import { exec as processExec, ExecOptions } from 'child_process';

type ExecArgs =
  | [command: string]
  | [command: string, options: { encoding: "buffer" | null; } & ExecOptions]
  | [command: string, options: { encoding: BufferEncoding; } & ExecOptions]
  | [command: string, options: { encoding: BufferEncoding; } & ExecOptions]
  | [command: string, options: ExecOptions];
  //| [command: string, options: (BaseEncodingOptions & ExecOptions) | null | undefined]

export const exec = (...args: ExecArgs): Promise<string> => new Promise((resolve, reject) => {
  // @ts-ignore
  processExec(...args, async (err, stdout) => {
    if (err) {
      return reject(err);
    }
    resolve(stdout);
  });
});
