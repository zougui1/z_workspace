import { Exception } from '@zougui/error';

export const extractError = (error: Error): IErrorExtraction => {
  const extraction: IErrorExtraction = {
    name: error.name,
    message: error.message,
    stack: error.stack,
  };

  if (error instanceof Exception) {
    extraction.code = error.code;

    extraction.details = error.details instanceof Error
      ? extractError(error.details)
      : error.details;
  }

  return extraction;
}

export interface IErrorExtraction {
  name: string;
  message: string;
  stack?: string;
  code?: string;
  details?: any;
}
