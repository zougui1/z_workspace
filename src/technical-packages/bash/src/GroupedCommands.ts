import { logExecuting, logExecuted, ExitScope, ProfileLog, LogKind } from '@zougui/logger';
import { execSpawn, indent } from '@zougui/utils';

import { ICommand } from './ICommand';
import { BashCommand, StringifyArgsOptions } from './BashCommand';
import { setEnvVar, SetEnvVarOptions } from './setEnvVar';

export enum CommandSeparation {
  separate = '; ',
  and = ' && ',
  pipe = ' | ',
}

export class GroupedCommands implements ICommand {

  commands: (BashCommand<any> | GroupedCommands)[] = [];
  envVars: IEnvVar[] = [];
  separator: CommandSeparation;

  constructor(separator: CommandSeparation) {
    this.separator = separator;
  }

  //#region public
  addCommand(command: (BashCommand<any> | GroupedCommands)): this {
    this.commands.push(command);
    return this;
  }

  addCommands(commands: (BashCommand<any> | GroupedCommands)[]): this {
    for (const command of commands) {
      this.addCommand(command);
    }

    return this;
  }

  setEnvVar(name: string, value: string | BashCommand<any> | GroupedCommands, options: SetEnvVarOptions = {}): this {
    const isValueCommand = typeof value !== 'string';
    const _options = isValueCommand ? { ...options, isScript: true } : options;

    this.envVars.push({
      name,
      value,
      options: _options,
    });

    return this;
  }

  toString(options: StringifyArgsOptions = {}): string {
    const commands = this.commands
      .map(command => {
        const commandStr = command instanceof GroupedCommands
          ? command.toString(options)
          : command.toString(undefined, options);

        return commandStr;
      });

    const stringifiedEnVars = this.envVars.map(envVar => {
      const value = typeof envVar.value === 'string'
        ? envVar.value
        : envVar.value instanceof GroupedCommands
          ? envVar.value.toString(options)
          : envVar.value.toString(undefined, options);

      const formattedValue = options.indent
        ? `\n${indent(value)}\n`
        : value;

      return setEnvVar(envVar.name, formattedValue, envVar.options);
    });

    const command = options.indent
      ? commands.join(`${this.separator}\n`)
      : commands.join(this.separator);

    const envVars = options.indent
      ? stringifiedEnVars.join('\n')
      : stringifiedEnVars.join(' ');

    const setEnvVarsLine = options.indent
      ? `${envVars}${CommandSeparation.separate}\n`
      : `${envVars}${CommandSeparation.separate}`;

    return stringifiedEnVars.length
      ? `${setEnvVarsLine}${command}`
      : command;
  }

  async isAvailableOrFail(): Promise<void> {
    const commands = this.commands.map(command => command);

    const envCommands = this.envVars
      .map(envVar => {
        if (typeof envVar.value === 'string') {
          return;
        }

        return envVar.value;
      })
      .filter(command => command) as BashCommand<any>[];

    const allCommands = [...envCommands, ...commands];
    const availables = await Promise.all(allCommands.map(async command => {
      try {
        await command.isAvailableOrFail();
        return true;
      } catch (error) {
        return false;
      }
    }));

    const missingCommands = availables.filter(available => !available);

    if (missingCommands.length) {
      throw new ExitScope('missing-command', new Error(`${missingCommands.length} commands are missing and must be installed.`));
    }
  }

  async isAvailable(): Promise<boolean> {
    const commands = this.commands.map(command => command);

    const envCommands = this.envVars
      .map(envVar => {
        if (typeof envVar.value === 'string') {
          return;
        }

        return envVar.value;
      })
      .filter(command => command) as BashCommand<any>[];

    const allCommands = [...envCommands, ...commands];
    const exists = await Promise.all(allCommands.map(async com => await com.isAvailable()));

    return exists.every(exist => exist);
  }

  async exec(): Promise<void> {
    const command = this.toString();
    //const description = this.toDescription();

    const log = new ProfileLog(command, {})
      .setMessage(LogKind.file, this.toString({ indent: true }))
      .setMessage(this.toString({ indent: true, aliases: true }));

    logExecuting(log);
    await execSpawn(command);
    logExecuted(log);
  }
  //#endregion

  //#region private
  toDescription(): string {
    const description = this.commands
      .map(command => command.toDescription())
      .join(this.separator);

    const stringifiedEnVarsDescriptions = this.envVars.map(envVar => {
      if (typeof envVar.value === 'string') {
        return '[string]'
      }

      return envVar.value.toDescription();
    });

    const envVarsDescription = stringifiedEnVarsDescriptions.join(' ');

    return stringifiedEnVarsDescriptions.length
      ? `${envVarsDescription}${CommandSeparation.separate}${description}`
      : description;
  }
  //#endregion
}

export interface IEnvVar {
  name: string;
  value: string | BashCommand<any> | GroupedCommands;
  options?: SetEnvVarOptions;
}
