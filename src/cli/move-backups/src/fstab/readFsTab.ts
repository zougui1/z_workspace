import fs from 'fs-extra';

export const readFsTab = async (): Promise<string> => {
  try {
    return await fs.readFile('/etc/fstab', 'utf8');
  } catch (error) {
    throw new Error('Could not read fstab at "/etc/fstab".');
  }
}
