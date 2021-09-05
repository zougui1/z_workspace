import crypto from 'crypto';

import { range } from '@zougui/utils';

import { encode } from './encode';
import { deriveKey } from './deriveKey';
import { randomBytes } from './randomBytes';

import {
  DEFAULT_HASH_TIME,
  DEFAULT_IV_LENGTH,
  DEFAULT_PADDING_LENGTH,
  DEFAULT_SALT_LENGTH,
  ENCODING_PARTS_LENGTHS_ENCODING,
  ENCRYPTION_PARTS,
  SECTIONS_SEPARATOR,
} from './constants';

const getPartsLength = ({ encrypted, ...parts }: Record<string, Buffer>): Record<string, number> => {
  return Object.entries(parts).reduce((partsLength, [name, buffer]) => {
    return {
      ...partsLength,
      [name]: buffer.length,
    };
  }, {} as Record<string, number>);
}

const stringifyPartsLength = (lengths: Record<string, number>): string => {
  return Object
    .entries(lengths)
    .map(([name, length]) => `${name}=${length}`)
    .join(',');
}

const getEncryptedParts = (partsDef: Record<string, Buffer>, partNames: string[]) => {
  const lengths = stringifyPartsLength(getPartsLength(partsDef));
  const lengthsBuf = encode(lengths, ENCODING_PARTS_LENGTHS_ENCODING, 'buffer');

  const parts = partNames.map(partName => {
    return partsDef[partName];
  });

  return Buffer.concat([lengthsBuf, Buffer.from(SECTIONS_SEPARATOR), ...parts]).toString('hex');
}

const getPaddings = async (paddingLength: number): Promise<Record<string, Buffer>> => {
  const paddings = await Promise.all(
    range(6).map(() => randomBytes(paddingLength))
  );

  return paddings.reduce((pads, padding, index) => {
    return {
      ...pads,
      // the padding start at 1
      [`padding${index + 1}`]: padding,
    };
  }, {} as Record<string, Buffer>);
}

export const encrypt = async (plain: string | Buffer, password: string, options: EncryptOptions): Promise<string> => {
  const hashTime = options.hashTime ?? DEFAULT_HASH_TIME;
  const ivLength = options.ivLength ?? DEFAULT_IV_LENGTH;
  const saltLength = options.saltLength ?? DEFAULT_SALT_LENGTH;
  const paddingLength = options.paddingLength ?? DEFAULT_PADDING_LENGTH;

  const iv = await randomBytes(ivLength);
  const salt = await randomBytes(saltLength);
  const paddings = await getPaddings(paddingLength);

  const derivedKey = await deriveKey(password, {
    hashTime,
    salt,
    extraSalts: [options.saltLeft, options.saltRight],
  });

  const cipher = crypto.createCipheriv('aes-256-gcm', derivedKey, iv);
  const encrypted = cipher.update(plain);
  const final = cipher.final();

  const encryptedPrivate = getEncryptedParts({
    ...paddings,
    encrypted,
    authTag: cipher.getAuthTag(),
    final,
    iv,
    salt,
  }, ENCRYPTION_PARTS);

  return encryptedPrivate;
}

export interface EncryptOptions {
  hashTime?: string;
  saltLength?: number;
  ivLength?: number;
  paddingLength?: number;
  saltLeft: string;
  saltRight: string;
}
