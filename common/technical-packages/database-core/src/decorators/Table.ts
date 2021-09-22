import Knex from 'knex';

import { Model } from '../Model';

export const Table = (connect: () => Knex<any, unknown[]>) => {
  return function TableDecorator(constructor: typeof Model) {
    // if we don't wait for the next tick some relation mappings
    // may be done too soon, before all the files could have been loaded
    // which would lead to errors
    // (a file A requring a file B that requires the file A)
    process.nextTick(() => constructor.connect(connect));
  }
}
