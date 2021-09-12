import qs from 'qs';

import { hash } from '@zougui/hash';
import { startWith, joinUrlPaths } from '@zougui/utils';
import env from '@zougui/env';

export const getSignature = (urlData: GetSignatureOptions): UrlSignature => {
  // it is important to explicitely give all the values
  // to the function has the order of the properties matters

  const url = 'url' in urlData ? urlData.url : getUrl(urlData);
  const signatureData: UrlSignatureObject = {
    url,
    privateKey: urlData.privateKey,
  };

  if (urlData.expires) {
    signatureData.expires = urlData.expires;
  }

  const signature = hash(JSON.stringify(signatureData), 'hex');
  const signedQueryString = qs.stringify({
    expires: urlData.expires,
    signature,
  });
  const signedUrl = `${url}?${signedQueryString}`;

  return {
    signature,
    expires: urlData.expires,
    url,
    signedUrl,
  };
}

export const getUrl = (options: StructuredGetSignatureOptions): string => {
  const host = options.host === 'localhost' ? `${options.host}:${options.port}` : options.host;
  const origin = joinUrlPaths(host, options.path);
  const protocol = env.isDev ? 'http' : 'https';

  return startWith(origin, `${protocol}://`);
}

interface UrlSignatureObject {
  url: string;
  expires?: number;
  privateKey: string;
}


interface BaseGetSignatureOptions {
  expires?: number;
  privateKey: string;
}

interface StructuredGetSignatureOptions {
  path: string;
  port: number;
  host: string;
}

interface StringGetSignatureOptions {
  url: string;
}

export type GetSignatureOptions = BaseGetSignatureOptions & (StructuredGetSignatureOptions | StringGetSignatureOptions);
export interface UrlSignature {
  url: string;
  expires?: number;
  signature: string;
  signedUrl: string;
}
