import { readFsTab } from './readFsTab';
import { parseFsTab } from './parseFsTab';
import { FsTabEntry } from './FsTabEntry';

export const getFsTab = async (): Promise<FsTabEntry[]> => {
  return parseFsTab(await readFsTab());
}
