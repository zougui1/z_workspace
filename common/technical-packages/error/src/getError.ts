import { getErrorMessage } from './getErrorMessage';

export const getError = (error: any): string => {
  return error?.stack || getErrorMessage(error);
}
