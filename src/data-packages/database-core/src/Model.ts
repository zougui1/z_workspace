import { Model as ObjectionModel } from 'objection';
import _ from 'lodash';
import pluralize from 'pluralize';
import Knex from 'knex';

const reModelSuffix = /Model$/;

export abstract class Model extends ObjectionModel {

  private static _tableName?: string;

  static get tableName(): string {
    if (this._tableName) {
      return this._tableName;
    }

    const cleanName = this.name.replace(reModelSuffix, '');
    const tableName = pluralize(_.snakeCase(cleanName));

    return this._tableName = tableName;
  }

  //#region automatically connect to the DB
  // before any operation is done if possible
  static connect<M>(this: M, connect: () => Knex<any, unknown[]>): M {
    return (this as unknown as typeof Model).bindKnex(connect()) as unknown as M;
  }
  //#endregion
}
