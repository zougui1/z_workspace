import shellEscape from 'shell-escape';

export class BashStdout {

  value: string;

  constructor(value: string) {
    this.value = value;
  }

  toString(): string {
    return `> ${shellEscape([this.value])}`;
  }
}
