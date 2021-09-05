const reWordSeparators = /[ |/\\:@&#]/g;
const reIllegalPathCharacters = /[#<>$+%!`&*'|{}?"=/:\\ @]/g;

export const sanitizeFileName = (fileName: string): string => {
  return fileName.replace(reWordSeparators, '_').replace(reIllegalPathCharacters, '');
}
