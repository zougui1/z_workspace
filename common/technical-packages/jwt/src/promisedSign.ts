import { sign, Secret, SignOptions } from 'jsonwebtoken';

export const promisedSign = (payload: string | object | Buffer, secretOrPrivateKey: Secret, options?: SignOptions): Promise<string> => {
  return new Promise((resolve, reject) => {
    // `options` isn't part of `sign`'s signature
    // when there is a callback but it IS supported
    // @ts-ignore
    sign(payload, secretOrPrivateKey, options, (error, encoded) => {
      if (error || !encoded) {
        return reject(error || new Error('No encoded JWT'));
      }

      resolve(encoded);
    });
  });
}
