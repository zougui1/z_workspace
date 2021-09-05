import { HttpResponseNoContent } from '@foal/core';

import { setCors } from '@zougui/cors';

export const acceptAnyOptionsRequest = (req: any, res: any, next: () => void): void => {
  if (req.method !== 'OPTIONS') {
    next();
    return;
  }

  const response = new HttpResponseNoContent();
  setCors(response);

  for (const [header, value] of Object.entries(response.getHeaders())) {
    res.setHeader(header, value);
  }

  res.status(response.statusCode).end();
}
