const alphabet = 'abcdefghijklmnopqrstuvwxyz';

export const getLetter = (index: number): string => {
  return alphabet.charAt(index % alphabet.length);
}
