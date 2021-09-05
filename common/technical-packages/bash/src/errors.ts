import { Exception } from '@zougui/error';

export interface MissingCommandErrorData {
  error: any;
}

export const MissingCommandError = new Exception<MissingCommandErrorData>()
  .setCode('error.command.missing')
  .setStatus(500)
  .setMessage('Missing command')
  .toClass();

export interface MissingManyCommandsErrorData {
  commands: string[];
}

export const MissingManyCommandsError = new Exception<MissingManyCommandsErrorData>()
  .setCode('error.commands.missing')
  .setStatus(500)
  .setMessage('Multiple commands are missing')
  .toClass();

export interface MissingManyUnknownCommandsErrorData {
  missingCount: number;
}

export const MissingManyUnknownCommandsError = new Exception<MissingManyUnknownCommandsErrorData>()
  .setCode('error.commands.missing')
  .setStatus(500)
  .setMessage('Multiple commands are missing')
  .toClass();
