import { Encoding } from './encode';

export const DEFAULT_HASH_TIME = '0.1s';
export const DEFAULT_SALT_LENGTH = 64;
export const DEFAULT_IV_LENGTH = 64;
export const DEFAULT_PADDING_LENGTH = 128;
export const ENCRYPTION_PARTS = [
  'padding1',
  'encrypted',
  'padding2',
  'final',
  'padding3',
  'authTag',
  'padding4',
  'iv',
  'padding5',
  'salt',
  'padding6',
];
export const SECTIONS_SEPARATOR = '$';
export const ENCODING_PARTS_LENGTHS_ENCODING: Encoding[] = ['hex', 'base64url'];
export const DECODING_PARTS_LENGTHS_ENCODING = ENCODING_PARTS_LENGTHS_ENCODING.slice().reverse();
