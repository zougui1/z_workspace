import argon2, { Options } from 'argon2';

import { findHashParams } from './findHashParams';

export const hash = async (plain: string | Buffer, options: HashOptions = {}): Promise<string> => {
  const maybeHashParams = options.hashTime
    ? await findHashParams(options.hashTime)
    : {};

  // the copy is intentional
  const _options = {
    ...maybeHashParams,
    ...options,
  };

  if (_options.salt) {
    delete _options.saltLength;
  }

  return await argon2.hash(plain, {
    ..._options,
    raw: false,
  });
}

export const { verify } = argon2;
export interface HashOptions extends Options {
  hashTime?: number | string;
}
