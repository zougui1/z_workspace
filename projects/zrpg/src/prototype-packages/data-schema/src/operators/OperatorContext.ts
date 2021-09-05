import { QueryType } from './QueryType';

export interface OperatorContext<T extends Record<string, any> = any> {
  value?: any;
  operator: T;
  prevValue?: any;
  field?: string | undefined;
  queryType?: QueryType;
}
