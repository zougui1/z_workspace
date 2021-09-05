import { writeFile } from './writeFile';
import { readFile } from './readFile';
import * as fs from './fsWrapped';

export * from './writeFile';
export * from './readFile';
export * from './readFile';
export * from './fsErrorWrapper';

export default {
  ...fs,
  readFile,
  writeFile,
};
