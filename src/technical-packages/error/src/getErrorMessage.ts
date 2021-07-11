export const getErrorMessage = (error: any): string => {
  return error?.message || error || 'No error message provided.';
}
