import shellEscape from 'shell-escape';
import { SpawnOptionsWithoutStdio } from 'child_process';
import commandExists from 'command-exists';
import { execSpawn, toArray } from '@zougui/utils';
import { logger } from '@zougui/logger';

import { ICommand } from './ICommand';
import { BashEnvVar } from './BashEnvVar';
import { BashStdout } from './BashStdout';
import { BashSubCommand } from './BashSubCommand';
import { MissingCommandError } from './errors';
import { MissingCommandLog, ExecutingCommandLog, ExecutedCommandLog, ICommand as ICommandJson } from './logs';

const reLastHash = /#$/;
const reMergeCommandSwitches = /(-[a-z+]) +-([a-z]+)/gi;

export class BashCommand<TArgs extends Record<string, any> & ICommandOptions, TResult = unknown> implements ICommand {

  public readonly name: string;
  public readonly description: string;
  private _parseOutput: (output: unknown) => TResult = output => output as any;
  private readonly _options?: BashCommandOptions<TArgs>;
  args?: TArgs;
  aliases?: Partial<Record<keyof TArgs, string>>;

  constructor(name: string, description: string, options?: BashCommandOptions<TArgs>) {
    this.name = shellEscape([name]).split(' ')[0];
    this.description = description;
    this._options = options;
  }

  //#region public
  clone(): BashCommand<TArgs, TResult> {
    const command = new BashCommand<TArgs, TResult>(this.name, this.description, this._options);
    command.parseOuput(this._parseOutput).setArgs(this.args);

    if (this.aliases) {
      command.aliases = this.aliases;
    }

    return command;
  }

  toString(options?: TArgs, stringifyOptions: StringifyArgsOptions = {}): string {
    const { parameters, sudo, command: subCommand, ..._options  } = options ?? this.args ?? {};

    const args = this.objectToArgs(_options, stringifyOptions);
    const params = this.sanitizeValue(parameters ?? [], stringifyOptions);

    let command = '';

    if (sudo) {
      command += 'sudo';
    }

    command += ` ${this.name}`;

    if (subCommand) {
      command += ` ${subCommand}`;
    }

    if (args) {
      command += ` ${args}`;
    }

    if (params) {
      command += ` ${params}`;
    }

    return command.trim();
  }

  toDescription(): string {
    return `[${this.name}]: ${this.description}`;
  }

  async isAvailableOrFail(): Promise<void> {
    try {
      await commandExists(this.name);
    } catch (error) {
      const exception = new MissingCommandError({ error });
      logger.error(new MissingCommandLog({
        error,
        command: this.toJson(),
      }));
      throw exception;
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      await commandExists(this.name);
    } catch (error) {
      return false;
    }

    return true;
  }

  async exec(): Promise<TResult> {
    const command = this.toString();

    logger.info(new ExecutingCommandLog({ command: this.toJson() }));
    const output = await execSpawn(command, this._options?.exec) as string;
    logger.info(new ExecutedCommandLog({ command: this.toJson() }));

    return this._parseOutput ? this._parseOutput(output) : output as any;
  }

  parseOuput(parser: (output: unknown) => TResult): this {
    this._parseOutput = parser;
    return this;
  }

  setArgs(options?: TArgs): this {
    this.args = options;
    return this;
  }

  setAliases(aliases: Partial<Record<keyof TArgs, string>>): this {
    this.aliases = aliases;
    return this;
  }
  //#endregion

  //#region private
  toJson(): ICommandJson {
    return {
      name: this.name,
      description: this.description,
      options: this._options,
      args: this.args,
      aliases: this.aliases,
    };
  }

  private sanitizeValue(value: any, options: StringifyArgsOptions = {}): string {
    if (value instanceof BashEnvVar) {
      return value.toEnvName();
    }

    if (value instanceof BashStdout) {
      return value.toString();
    }

    if (value instanceof BashSubCommand) {
      return value.toSubCommand(options);
    }

    if (value instanceof BashCommand) {
      return new BashSubCommand(value).toSubCommand(options);
    }

    return shellEscape(toArray(value));
  }

  private valueToArg(originalName: string, value?: any, options: StringifyArgsOptions = {}): string {
    const replaceableHashtag = reLastHash.test(originalName);
    const name = replaceableHashtag
      ? originalName.slice(0, -1)
      : originalName;

    const alias = (options.aliases && this.aliases) ? this.aliases[originalName] : undefined;
    const safeAlias = alias ? shellEscape([alias]) : undefined;
    const safeName = shellEscape([originalName]);
    const argName = safeAlias || safeName;

    const dashes = (name.length === 1 || safeAlias) ? '-' : '--';

    if (value === null || value === undefined || value === true) {
      return `${dashes}${argName}`;
    }

    if (Array.isArray(value) && this._options?.[name]?.multiple) {
      return value.map(val => this.valueToArg(name, val)).join(' ');
    }

    const safeValues = toArray(value).map(val => this.sanitizeValue(val, options));

    return replaceableHashtag
      ? `${dashes}${name}${safeValues.join(' ')}`
      : `${dashes}${argName} ${safeValues.join(' ')}`;
  }

  private objectToArgs(args: Record<string, any>, options: StringifyArgsOptions = {}): string {
    return Object
      .entries(args)
      .map(([name, value]) => this.valueToArg(name, value, options))
      .join(' ')
      .replace(reMergeCommandSwitches, '$1$2');
  }
  //#endregion
}

export interface IArgOptions {
  multiple?: boolean;
}

export type BashCommandOptions<TArgs> = Partial<Record<keyof TArgs, IArgOptions>> & {
  exec?: SpawnOptionsWithoutStdio;
}

export type ICommandOptions = {
  command?: string;
  parameters?: string[];
  sudo?: boolean;
}

export type StringifyArgsOptions = {
  aliases?: boolean;
  indent?: boolean;
}
