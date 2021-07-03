import { bash } from '../bash';
import { GroupedCommands } from '../GroupedCommands';

export const compress = (options: CompressOptions): GroupedCommands => {
  const { input, output, threads, progressBar, autoRemove } = options;

  // compute the size of `input`
  const du = bash.du({
    summarize: true,
    bytes: true,
    parameters: [input],
  });
  // format the bytes
  const awk = bash.awk({
    parameters: ['{print $1}']
  });

  // put the `input` into a tarball
  const tar = bash.tar({
    create: true,
    file: ['-', input],
    'absolute-names': true,
  });
  // show a progress bar of the compression
  const pv = bash.pv({
    name: progressBar?.label,
    size: bash.envVar('SIZE'),
  });

  // compress the tarball using the zstd compression algorithm
  const zstd = bash.zstd({
    'T#': threads,
    'exclude-compressed': true,
    stdout: bash.stdout(output),
  });

  // remove the `input`
  const rm = bash.rm({
    recursive: true,
    force: true,
    parameters: [input]
  });

  const compressCommand = progressBar
    ? bash.pipe(tar, pv, zstd)
    : bash.pipe(tar, zstd);

  const command = autoRemove
    ? bash.and(compressCommand, rm)
    : compressCommand;

  if (progressBar) {
    command.setEnvVar('SIZE', bash.pipe(du, awk));
  }

  return command;
}

export interface CompressOptions {
  input: string;
  output: string;
  threads?: number;
  progressBar?: {
    label: string;
  };
  autoRemove?: boolean;
}
