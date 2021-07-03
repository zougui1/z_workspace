import shellEscape from 'shell-escape';

export class BashEnvVar {
  readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  toEnvName(): string {
    return `$${shellEscape([this.name])}`;
  }
}
