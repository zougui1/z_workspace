import { bash, RsyncInfo } from '@zougui/bash';

export const copyBackupToPartition = async (input: string, output: string): Promise<void> => {
  const rsync = bash.rsync({
    recursive: true,
    archive: true,
    info: RsyncInfo.progress2,
    parameters: [input, output],
  });

  await rsync.exec();
}
