import { LogBuilder } from '@zougui/logger';
import { formatList } from '@zougui/utils';
import env from '@zougui/env';

const scope = env.getScope(__filename);

export interface MissingCommandLogData {
  error: any;
  command: ICommand;
}

export const MissingCommandLog = new LogBuilder<MissingCommandLogData>()
  .setCode('command.missing')
  .setScope(scope)
  .setTopics(['CLI', 'bash'])
  .setMessage(({ data }) => `The command ${data.command.name} is required and must be installed.`)
  .toClass();

export interface MissingManyCommandsLogData {
  error: any;
  commands: string[];
}

export const MissingManyCommandsLog = new LogBuilder<MissingManyCommandsLogData>()
  .setCode('commands.missing')
  .setScope(scope)
  .setTopics(['CLI', 'bash'])
  .setMessage(({ data }) => formatList('The following commands are missing and must be installed:', data.commands))
  .toClass();

export interface ExecuteCommandLogData {
  command: ICommand;
}

export const ExecutingCommandLog = new LogBuilder<ExecuteCommandLogData>()
  .setCode('command.execute.start')
  .setScope(scope)
  .setProfile(({ data }) => JSON.stringify(data.command))
  .setTopics(['CLI', 'bash', 'execute'])
  .setMessage(({ data }) => `Executing the command ${data.command.name}...`)
  .toClass();

export const ExecutedCommandLog = new LogBuilder<ExecuteCommandLogData>()
  .setCode('command.execute.success')
  .setScope(scope)
  .setProfile(({ data }) => JSON.stringify(data.command))
  .setTopics(['CLI', 'bash', 'execute'])
  .setMessage(({ data }) => `Executed the command ${data.command.name}`)
  .toClass();

export interface ExecuteGroupedCommandLogData {
  group: IGroupedCommands;
}

const getGroupNames = (group: IGroupedCommands | ICommand): string => {
  if ('name' in group) {
    return group.name;
  }

  return group.commands.map(c => getGroupNames(c)).join(', ');
}

export const ExecutingGroupedCommandLog = new LogBuilder<ExecuteGroupedCommandLogData>()
  .setCode('command.group.execute.start')
  .setScope(scope)
  .setProfile(({ data }) => JSON.stringify(data.group))
  .setTopics(['CLI', 'bash', 'execute'])
  .setMessage(({ data }) => `Executing the commands ${data.group.commands.map(c => getGroupNames(c)).join(', ')}...`)
  .toClass();

export const ExecutedGroupedCommandLog = new LogBuilder<ExecuteGroupedCommandLogData>()
  .setCode('command.group.execute.success')
  .setScope(scope)
  .setProfile(({ data }) => JSON.stringify(data.group))
  .setTopics(['CLI', 'bash', 'execute'])
  .setMessage(({ data }) => `Executed the commands ${data.group.commands.map(c => getGroupNames(c)).join(', ')}`)
  .toClass();

export interface ICommand {
  name: string;
  description: string;
  options?: Record<string, any>;
  args?: Record<string, any>;
  aliases?: Record<string, any>;
}

export interface IGroupedCommands {
  commands: (ICommand | IGroupedCommands)[];
  envVars: IEnvVar[];
  separator: string;
}

export interface IEnvVar {
  name: string;
  value: string | ICommand | IGroupedCommands;
  options?: Record<string, any>;
}
