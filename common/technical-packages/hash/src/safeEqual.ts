import crypto from 'crypto';

const toBuffer = (data: string | Buffer): Buffer => {
  return data instanceof Buffer ? data : Buffer.from(data);
}

export const safeEqual = (a: string | Buffer, b: string | Buffer): boolean => {
  const bufferA = toBuffer(a);
  const bufferB = toBuffer(b);

  return bufferA.length === bufferB.length
    ? crypto.timingSafeEqual(bufferA, bufferB)
    : false;
}
