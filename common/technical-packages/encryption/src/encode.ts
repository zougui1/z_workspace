export function encode(text: string, encoding: Encoding | Encoding[], as?: 'string'): string;
export function encode(text: string, encoding: Encoding | Encoding[], as: 'buffer'): Buffer;
export function encode(text: string, encoding: Encoding | Encoding[], as?: 'string' | 'buffer'): string | Buffer;
export function encode(text: string, encoding: Encoding | Encoding[], as?: 'string' | 'buffer'): string | Buffer {
  const encoded = Array.isArray(encoding)
    ? encoding.reduce((encodedAcc, encodingItem) => encode(encodedAcc, encodingItem), text)
    : Buffer.from(text).toString(encoding);

  return as === 'buffer'
    ? Buffer.from(encoded)
    : encoded;
}

export function decode(text: string, encoding: Encoding | Encoding[], as?: 'string'): string;
export function decode(text: string, encoding: Encoding | Encoding[], as: 'buffer'): Buffer;
export function decode(text: string, encoding: Encoding | Encoding[], as?: 'string' | 'buffer'): string | Buffer;
export function decode(text: string, encoding: Encoding | Encoding[], as?: 'string' | 'buffer'): string | Buffer {
  const decoded = Array.isArray(encoding)
    ? encoding.reduce((decodedAcc, encodingItem) => decode(decodedAcc, encodingItem), text)
    : Buffer.from(text, encoding).toString();

  return as === 'buffer'
    ? Buffer.from(decoded)
    : decoded;
}

export type Encoding = 'utf8' | 'ascii' | 'hex' | 'base64url' | 'base64';
