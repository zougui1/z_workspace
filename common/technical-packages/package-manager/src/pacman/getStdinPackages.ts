import { EventEmitter } from 'events';

const stdinInputs: string[] = [];
const event = new EventEmitter();

process.stdin.on('data', data => {
  stdinInputs.push(data.toString());
  event.emit('stdin');
});

const getStdinPackages = (): string[] => {
  if (!stdinInputs.length) {
    return [];
  }

  return stdinInputs[0].split('\n').filter(line => line);
}

export const getUpdatedPackageNames = (options: IGetUpdatedPackageNamesOptions): Promise<string[]> => {
  return new Promise<string[]>((resolve, reject) => {
    if (stdinInputs.length) {
      return resolve(getStdinPackages());
    }

    const handleTimeout = () => {
      event.off('stdin', handleStdin);
      clearTimeout(timeout);
      reject(new Error('No package names were updated.'));
    }
    const handleStdin = () => {
      clearTimeout(timeout);
      resolve(getStdinPackages());
    }

    const timeout = setTimeout(handleTimeout, options.timeout);
    event.once('stdin', handleStdin);
  });
}

export interface IGetUpdatedPackageNamesOptions {
  timeout: number;
}
