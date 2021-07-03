export enum FsIdType {
  uuid = 'uuid',
  label = 'label',
  partLabel = 'partlabel',
  device = 'device',
}

export type FsIdentifier = { type: FsIdType; id: string };

export interface FsTabEntry {
  fileSystem: FsIdentifier;
  mountPoint: string;
  type: string;
  options: Record<string, string>;
  dump: boolean;
  pass: number;
}
