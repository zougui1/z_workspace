import { makeStyles as muiMakeStyles } from '@material-ui/core';

import { ClassNameMap, Styles } from './types';

export const makeStyles = <ClassKey extends string = string>(styles: Styles<any, {}, ClassKey>): ((props?: any) => ClassNameMap<ClassKey>) => {
  return muiMakeStyles(styles as any);
}
