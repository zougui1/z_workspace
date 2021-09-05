export const getSafeNumber = (dirtyNumber: number): number | undefined => {
  const cleanedNumber = +dirtyNumber;

  return isNaN(cleanedNumber)
    ? undefined
    : cleanedNumber;
}
