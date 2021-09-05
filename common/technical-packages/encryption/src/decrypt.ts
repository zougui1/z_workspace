import crypto from 'crypto';

import { decode } from './encode';
import { deriveKey } from './deriveKey';

import {
  DEFAULT_HASH_TIME,
  DECODING_PARTS_LENGTHS_ENCODING,
  ENCRYPTION_PARTS,
  SECTIONS_SEPARATOR,
} from './constants';

const parsePartsLength = (partsLength: string): Record<string, number> => {
  return decode(partsLength, DECODING_PARTS_LENGTHS_ENCODING)
    .split(',')
    .map(val => val.split('='))
    .reduce((lengths, [name, value]) => {
      return {
        ...lengths,
        [name]: +value,
      };
    }, {} as Record<string, number>);
}

const getBufferParts = (buffer: Buffer, partNames: string[]) => {
  let index = 0;
  const parts: any = {};

  const splitIndex = buffer.indexOf(SECTIONS_SEPARATOR)
  const lengthsBuf = buffer.slice(0, splitIndex);
  const lengths = parsePartsLength(lengthsBuf.toString());
  const encBuf = buffer.slice(splitIndex + 1);

  lengths.encrypted = encBuf.length - (Object.values(lengths).reduce((length, partLength) => length + partLength, 0));

  for (const partName of partNames) {
    const end = index + lengths[partName];
    parts[partName] = encBuf.slice(index, end);
    index = end;
  }


  //console.log('parts', parts)
  return parts;
}

export async function decrypt(
  cipher: string | Buffer,
  password: string,
  options: DecryptOptions & { contentType?: 'utf8' }
): Promise<string>;
export async function decrypt(
  cipher: string | Buffer,
  password: string,
  options: DecryptOptions & { contentType: 'buffer' }
): Promise<Buffer>;
export async function decrypt(
  cipher: string | Buffer,
  password: string,
  options: DecryptOptions
): Promise<string | Buffer>;
export async function decrypt(cipher: string | Buffer, password: string, options: DecryptOptions): Promise<string | Buffer> {
  const hashTime = options.hashTime ?? DEFAULT_HASH_TIME;

  const encryptedBuffer = cipher instanceof Buffer
    ? cipher
    : Buffer.from(cipher, 'hex');

  const { encrypted, authTag, iv, salt } = getBufferParts(encryptedBuffer, ENCRYPTION_PARTS);

  const derivedKey = await deriveKey(password, {
    hashTime,
    salt,
    extraSalts: [options.saltLeft, options.saltRight],
  });

  const decipher = crypto.createDecipheriv('aes-256-gcm', derivedKey, iv).setAuthTag(authTag);
  const deryptedBuffer = Buffer.concat([decipher.update(encrypted), decipher.final()]);

  return options.contentType === 'buffer'
    ? deryptedBuffer
    : deryptedBuffer.toString();
}

export interface DecryptOptions {
  hashTime?: string;
  contentType?: 'utf8' | 'buffer';
  saltLeft: string;
  saltRight: string;
}
