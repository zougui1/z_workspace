export const getNumber = (dirtyNumber: any, defaultNumber?: number): number => {
  const cleanedNumber = +dirtyNumber;

  return typeof defaultNumber === 'number'
    ? isNaN(cleanedNumber) ? defaultNumber : cleanedNumber
    : cleanedNumber;
}
