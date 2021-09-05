export const isObjectEmpty = (object: Record<string, any>): boolean => {
  return Object.keys(object).length === 0;
}
