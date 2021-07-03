const spacePerIndent = 2;

export const indent = (text: string, level: number = 1, options: IndentOptions = {}): string => {
  const indentation = ' '.repeat(level * (options.spacePerIndent ?? spacePerIndent));

  return text
    .split('\n')
    .map(line => `${indentation}${line}`)
    .join('\n');
}

export interface IndentOptions {
  spacePerIndent?: number;
}
