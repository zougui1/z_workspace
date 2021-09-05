import { FsTabEntry, FsIdentifier, FsIdType } from './FsTabEntry';

const reMultipleSpaces = /\s+/g;

export const parseFsTab = (fstab: string): FsTabEntry[] => {
  const dirtyEntries = fstab
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'));

  return dirtyEntries.map(parseFsEntry);
}

const parseFsEntry = (dirtyEntry: string): FsTabEntry => {
  const [dirtyFs, dirtyMountPoint, dirtyType, dirtyOptions, dirtyDump, dirtyPass] = dirtyEntry.split(reMultipleSpaces);

  if (!dirtyFs) {
    throw new Error('[parse] [fstab] invalid entry. Missing <file system>');
  }

  if (!dirtyMountPoint) {
    throw new Error('[parse] [fstab] invalid entry. Missing <mount point>');
  }

  if (!dirtyType) {
    throw new Error('[parse] [fstab] invalid entry. Missing <type>');
  }

  if (!dirtyOptions) {
    throw new Error('[parse] [fstab] invalid entry. Missing <options>');
  }

  if (!dirtyDump) {
    throw new Error('[parse] [fstab] invalid entry. Missing <dump>');
  }

  if (!dirtyPass) {
    throw new Error('[parse] [fstab] invalid entry. Missing <dump>');
  }

  const fs = parseEntryFs(dirtyFs);
  const options = parseEntryOptions(dirtyOptions);
  const dump = parseEntryDump(dirtyDump);
  const pass = parseEntryPass(dirtyPass);

  return {
    fileSystem: fs,
    mountPoint: dirtyMountPoint,
    type: dirtyType,
    options,
    dump,
    pass,
  };
}

const parseEntryFs = (dirtyFs: string): FsIdentifier => {
  let [originalDirtyFsIdType, dirtyFsId] = dirtyFs.split('=');
  let dirtyFsIdType = originalDirtyFsIdType;

  if (!dirtyFsId) {
    dirtyFsId = dirtyFsIdType;
    dirtyFsIdType = 'device';
  }

  dirtyFsIdType = dirtyFsIdType.toLowerCase();

  switch (dirtyFsIdType) {
    case 'uuid':
    case 'label':
    case 'device':
      return { type: FsIdType[dirtyFsIdType], id: dirtyFsId };
    case 'partlabel':
      return { type: FsIdType.partLabel, id: dirtyFsId };

    default:
      throw new Error(`[parse] [fstab] invalid entry. Expected <file system> to identify a 'device', 'UUID', 'LABEL' or 'PARTLABEL'; Tried to identify "${originalDirtyFsIdType}".`);
  }
}

const parseEntryOptions = (dirtyOptionsString: string): Record<string, any> => {
  const dirtyOptions = dirtyOptionsString.split(',');

  const options = dirtyOptions.reduce((acc, dirtyOption) => {
    const [optionName, dirtyOptionValue] = dirtyOption.split('=');

    const optionValue = dirtyOptionValue
      ? dirtyOptionValue.replace(/^"?(.*)"?$/, '$1')
      : true;

    return {
      ...acc,
      [optionName]: optionValue,
    }
  }, {} as Record<string, any>);

  return options;
}

const parseEntryDump = (dirtyDump: string): boolean => {
  const dirtyDumpNum = +dirtyDump;

  if (isNaN(dirtyDumpNum)) {
    throw new Error(`[parse] [fstab] invalid entry. <dump> must be a number, got "${dirtyDump}"`);
  }

  return Boolean(dirtyDumpNum);
}

const parseEntryPass = (dirtyPass: string): number => {
  const dirtyPassNum = +dirtyPass;

  if (isNaN(dirtyPassNum)) {
    throw new Error(`[parse] [fstab] invalid entry. <pass> must be a number, got "${dirtyPass}"`);
  }

  return dirtyPassNum;
}
