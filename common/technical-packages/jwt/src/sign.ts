import * as jwt from 'jsonwebtoken';
import * as uuid from 'uuid';

import { promisedSign } from './promisedSign';
import { SECRET } from './env';

export const sign = async (payload: object, options?: SignOptions): Promise<string> => {
  const accessTokenSecret = options?.secretOrPrivateKey || SECRET;

  if (!accessTokenSecret) {
    throw new Error('Missing access token secret');
  }

  const tokenPayload = {
    ...payload,
    jti: uuid.v4(),
    grantType: 'access_token'
  };

  const accessToken = await promisedSign(tokenPayload, accessTokenSecret, options);

  return accessToken;
}

export interface SignOptions extends jwt.SignOptions {
  secretOrPrivateKey?: jwt.Secret;
}
