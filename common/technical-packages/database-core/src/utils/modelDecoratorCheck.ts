import { Model } from '../Model';

export const modelDecoratorCheck = (object: unknown, decoratorName: string) => {
  if (!(object instanceof Model)) {
    throw new Error(`The decorator '${decoratorName}' must be use on an instance of 'Model'`);
  }
}
