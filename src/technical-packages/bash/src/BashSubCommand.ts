import { BashCommand, StringifyArgsOptions } from './BashCommand';
import { GroupedCommands } from './GroupedCommands';

export class BashSubCommand {
  readonly command: string | BashCommand<any> | GroupedCommands;
  readonly options?: BashSubCommandOptions;

  constructor(command: string | BashCommand<any> | GroupedCommands, options?: BashSubCommandOptions) {
    this.command = command;
    this.options = options;
  }

  toSubCommand(options: StringifyArgsOptions = {}): string {
    const command = this.command instanceof GroupedCommands
      ? this.command.toString(options)
      : this.command.toString(undefined, options);

    const formattedCommand = options.indent && this.command instanceof GroupedCommands
      ? `\n${command}\n`
      : command;

    if (this.options?.inline) {
      return `\`${formattedCommand}\``;
    }

    return `$(${formattedCommand})`;
  }
}

export interface BashSubCommandOptions {
  inline?: boolean;
}
