const codeBlockPlaceholder = '```';

export const isCodeBlock = (message: string, language: string = ''): boolean => {
  const startPlaceholder = `${codeBlockPlaceholder}${language}`;

  return message.startsWith(startPlaceholder) && message.endsWith(codeBlockPlaceholder);
}

export const extractCode = (message: string, language: string = ''): string => {
  const startPlaceholder = `${codeBlockPlaceholder}${language}`;

  return message.slice(startPlaceholder.length, message.length - codeBlockPlaceholder.length);
}

export const preventEmbed = (message: string): string => {
  return `<${message}>`;
}

export const underline = (message: string): string => {
  return `__${message}__`;
}

export const italic = (message: string): string => {
  return `*${message}*`;
}

export const bold = (message: string): string => {
  return `**${message}**`;
}

export const spoiler = (message: string): string => {
  return `||${message}||`;
}

export const quote = (message: string): string => {
  return `> ${message}`;
}

export const putInCodeBlock = (message: string, language: string = ''): string => {
  return `${codeBlockPlaceholder}${language}\n${message}\n${codeBlockPlaceholder}`;
}

export const getJsonCodeBlock = (data: any): string => {
  const json = JSON.stringify(data, null, 2);
  return putInCodeBlock(json, 'json');
}
