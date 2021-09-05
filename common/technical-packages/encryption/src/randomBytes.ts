import crypto from 'crypto';

export const randomBytes = (size: number): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(size, (err, bytes) => {
      if (err) {
        return reject(err);
      }

      resolve(bytes);
    });
  });
}
