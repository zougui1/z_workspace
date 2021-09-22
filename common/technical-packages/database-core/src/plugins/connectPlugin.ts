import Knex from 'knex';
import { Model as ObjectionModel } from 'objection';

export const connectPlugin = <T extends typeof ObjectionModel>(Model: T): T & { connect<M>(this: M, connect: () => Knex<any, unknown[]>): M } => {
  return class ConnectPlugin extends (Model as typeof ObjectionModel) {
    // before any operation is done if possible
    static connect<M>(this: M, connect: () => Knex<any, unknown[]>): M {
      return (this as unknown as typeof Model).bindKnex(connect()) as unknown as M;
    }
  } as any;
}
