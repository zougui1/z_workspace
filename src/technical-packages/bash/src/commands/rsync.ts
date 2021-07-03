import { BashCommand } from '../BashCommand';

export const rsync = new BashCommand<RsyncArgs, string>('rsync', 'copy `input` to `output`', {
  exclude: { multiple: true },
});

rsync.setAliases({
  recursive: 'r',
  archive: 'a',
});

export interface RsyncArgs {
  recursive?: boolean;
  archive?: boolean;
  info?: RsyncInfo;
  exclude?: string[];
  parameters: [string, string];
}

export enum RsyncInfo {
  progress = 'progress',
  progress2 = 'progress2',
}
