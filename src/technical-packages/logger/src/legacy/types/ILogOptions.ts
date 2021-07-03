import moment from 'moment';

import { StackFrame } from '../stackTrace';

export interface ILogOptions {
  logDate: moment.Moment;
  stack?: StackFrame[] | StackFrame;
  prettyStack?: string;
  noFormat?: boolean;
}

export interface IStandardLogOptions {
  namespace?: string;
  label?: string;
}

export interface IProfileLogOptions {
  label?: string;
  message?: any;
}
