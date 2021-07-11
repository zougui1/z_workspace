import { HttpResponse, HttpResponseBadRequest, HttpResponseInternalServerError } from '@foal/core';
import { Exception } from '@zougui/error';

export const resolveHttpErrorResponse = (error: any): HttpResponse => {
  if (error instanceof Exception && error.status) {
    switch (error.status) {
      case 400:
        return new HttpResponseBadRequest(error.message);
      case 500:
        return new HttpResponseInternalServerError(error.message);
    }
  }

  return new HttpResponseInternalServerError(error?.message || error || 'No error message provided.');
}
