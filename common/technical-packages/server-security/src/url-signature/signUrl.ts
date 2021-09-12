import ms from 'ms';

import { getSignature, UrlSignature } from './getSignature';

export const signUrl = ({ expiry, ...options }: SignUrlOptions): UrlSignature => {
  const expiryNumber = typeof expiry === 'string'
    ? ms(expiry)
    // either the milliseconds in which it expires or no expiration
    : expiry;

  const expires = expiryNumber ? Date.now() + expiryNumber : undefined;

  return getSignature({
    ...options,
    expires,
    privateKey: options.privateKey,
  });
}

interface BaseSignUrlOptions {
  url?: string;
  expiry?: string | number;
  privateKey: string;
}

interface StructuredSignUrlOptions extends BaseSignUrlOptions {
  host: string;
  port: number;
  path: string;
}

interface StringSignUrlOptions extends BaseSignUrlOptions {
  url: string;
}

export type SignUrlOptions = StructuredSignUrlOptions | StringSignUrlOptions;
