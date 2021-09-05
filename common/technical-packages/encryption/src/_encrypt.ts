import crypto from 'crypto';

import { deriveKey, deriveKeyFromSalt } from '@zougui/hash';

import { encode, decode, Encoding } from './encode';

const HASH_TIME = '0.1s';
const SALT_LENGTH = 64;
const IV_LENGTH = 64;
const ENCRYPTION_PARTS = ['padding1', 'encrypted', 'padding2', 'authTag', 'padding3', 'iv', 'padding4', 'salt', 'padding5'];
const PADDING_LENGTH = 128;
const partsSeparator = '$';
const encodingPartsLengthEncoding: Encoding[] = ['hex', 'base64url'];
const decodingPartsLengthEncoding = encodingPartsLengthEncoding.slice().reverse();

// TODO refactor

const hashPassword = (password: string): Buffer => {
  // the salts have to be consistent
  const saltedPassword = `${process.env.PASSWORD_SALT_LEFT}${password}${process.env.PASSWORD_SALT_RIGHT}`;
  return crypto.createHash('sha256').update(saltedPassword).digest();
}

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

const parsePartsLength = (partsLength: string): Record<string, number> => {
  return decode(partsLength, decodingPartsLengthEncoding)
    .split(',')
    .map(val => val.split('='))
    .reduce((lengths, [name, value]) => {
      return {
        ...lengths,
        [name]: +value,
      };
    }, {} as Record<string, number>);
}

const getEncryptedParts = (partsDef: Record<string, Buffer>, partNames: string[]) => {
  const lengths = stringifyPartsLength(getPartsLength(partsDef));
  const lengthsBuf = encode(lengths, encodingPartsLengthEncoding, 'buffer');

  const parts = partNames.map(partName => {
    return partsDef[partName];
  });

  return Buffer.concat([lengthsBuf, Buffer.from(partsSeparator), ...parts]).toString('hex');
}

const getBufferParts = (buffer: Buffer, partNames: string[]) => {
  let index = 0;
  const parts: any = {};

  const splitIndex = buffer.indexOf(partsSeparator)
  const lengthsBuf = buffer.slice(0, splitIndex);
  const lengths = parsePartsLength(lengthsBuf.toString());
  const encBuf = buffer.slice(splitIndex + 1);

  lengths.encrypted = encBuf.length - (Object.values(lengths).reduce((length, partLength) => length + partLength, 0));

  console.log('lengths', lengths)

  for (const partName of partNames) {
    const end = index + lengths[partName];
    parts[partName] = encBuf.slice(index, end);
    index = end;
  }


  //console.log('parts', parts)
  return parts;
}

export const encrypt = async (plain: string | Buffer, password: string): Promise<string> => {
  const iv = crypto.randomBytes(IV_LENGTH);

  const { salt, hash } = await deriveKey(password, {
    hashTime: HASH_TIME,
    saltLength: SALT_LENGTH,
  });

  const derivedKey = hashPassword(hash);
  const cipher = crypto.createCipheriv('aes-256-gcm', derivedKey, iv);

  const encrypted = cipher.update(plain);
  const final = cipher.final();
  //console.log('encrypted', encrypted)

  const encryptedPrivate = getEncryptedParts({
    encrypted,
    authTag: cipher.getAuthTag(),
    final,
    iv,
    salt,
    padding1: crypto.randomBytes(PADDING_LENGTH),
    padding2: crypto.randomBytes(PADDING_LENGTH),
    padding3: crypto.randomBytes(PADDING_LENGTH),
    padding4: crypto.randomBytes(PADDING_LENGTH),
    padding5: crypto.randomBytes(PADDING_LENGTH),
  }, ENCRYPTION_PARTS);

  return encryptedPrivate;
}

export async function decrypt(
  cipher: string | Buffer,
  password: string,
  options?: DecryptOptions & { contentType?: DecryptionContentType.utf8 }
): Promise<string>;
export async function decrypt(
  cipher: string | Buffer,
  password: string,
  options: DecryptOptions & { contentType: DecryptionContentType.buffer }
): Promise<Buffer>;
export async function decrypt(
  cipher: string | Buffer,
  password: string,
  options: DecryptOptions
): Promise<string | Buffer>;
export async function decrypt(cipher: string | Buffer, password: string, options?: DecryptOptions): Promise<string | Buffer> {
  const encryptedBuffer = cipher instanceof Buffer
    ? cipher
    : Buffer.from(cipher, 'hex');

  const { encrypted, authTag, iv, salt } = getBufferParts(encryptedBuffer, ENCRYPTION_PARTS);

  //console.log('encrypted', encrypted)

  const hash = await deriveKeyFromSalt(password, {
    hashTime: HASH_TIME,
    salt,
  });

  const derivedKey = hashPassword(hash);
  const decipher = crypto.createDecipheriv('aes-256-gcm', derivedKey, iv).setAuthTag(authTag);

  const deryptedBuffer = Buffer.concat([decipher.update(encrypted), decipher.final()]);

  return options?.contentType === DecryptionContentType.buffer
    ? deryptedBuffer
    : deryptedBuffer.toString();
}

export enum DecryptionContentType {
  utf8 = 'utf8',
  buffer = 'buffer',
}

export interface DecryptOptions {
  contentType?: DecryptionContentType;
}
