import crypto from 'crypto';

import { hash } from '@zougui/hash';

const hashPassword = (password: string, [saltLeft, saltRight]: [string, string]): Buffer => {
  // the salts have to be consistent
  const saltedPassword = `${saltLeft}${password}${saltRight}`;
  return crypto.createHash('sha256').update(saltedPassword).digest();
}

export const deriveKey = async (password: string, options: DeriveKeyOptions): Promise<Buffer> => {
  const { hashTime, salt, extraSalts } = options;

  const hashed = await hash(password, { hashTime, salt });
  const derivedKey = hashPassword(hashed, extraSalts);

  return derivedKey;
}

export interface DeriveKeyOptions {
  hashTime: string;
  salt: Buffer;
  extraSalts: [string, string];
}
