import shellEscape from 'shell-escape';

export const setEnvVar = (name: string, value: string, options: SetEnvVarOptions = {}): string => {
  const safeName = shellEscape([name]).split(' ')[0];

  if (options.isScript) {
    return `${safeName}=(\`${value}\`)`;
  }

  return `${safeName}=${shellEscape([value])}`;
}

export interface SetEnvVarOptions {
  isScript?: boolean;

}
