import { safeEqual } from '@zougui/hash';

import { getSignature, GetSignatureOptions } from './getSignature';

export const checkSignature = (expectedSignature: string | undefined, data: GetSignatureOptions): boolean => {
  if (!expectedSignature) {
    return false;
  }

  const { signature } = getSignature(data);

  if (!safeEqual(expectedSignature, signature)) {
    return false;
  }

  // the signature is good if there is no expiration
  // or if the expiration timestamp is after now
  return typeof data.expires !== 'number' || Date.now() <= data.expires;
}
