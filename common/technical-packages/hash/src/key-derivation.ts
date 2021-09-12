import crypto from 'crypto';

import { createArgon2Hash, HashOptions } from './createArgon2Hash';

export const deriveKeyWithSalt = async (plain: string, options: DeriveKeyOptions): Promise<DerivedKey> => {
  const salt = crypto.randomBytes(options.saltLength);
  const hashed = await createArgon2Hash(plain, {
    ...options,
    saltLength: undefined,
    salt,
  });

  return { salt, hash: hashed };
}

export const deriveKey = async (plain: string, options: DeriveKeyFromSaltOptions): Promise<string> => {
  const hashed = await createArgon2Hash(plain, {
    ...options,
    saltLength: undefined,
  });

  return hashed;
}

export interface DeriveKeyOptions extends Omit<HashOptions, 'salt'> {
  saltLength: number;
}

export interface DeriveKeyFromSaltOptions extends Omit<HashOptions, 'saltLength'> {
  salt: Buffer;
}

export interface DerivedKey {
  salt: Buffer;
  hash: string;
}
