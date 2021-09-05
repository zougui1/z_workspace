import { FileStateMissingError } from '../errors';

export const checkFileState = (state: any): void => {
  if (!state?.dir || !state?.fileName || !state?.file) {
    throw new FileStateMissingError({});
  }
}
