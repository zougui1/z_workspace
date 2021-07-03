import { BashCommand } from '../BashCommand';

export const blkid = new BashCommand<BlkidArgs, string>('blkid', 'probe devices');

export interface BlkidArgs {}
