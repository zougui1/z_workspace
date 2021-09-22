import { Model as ObjectionModel } from 'objection';
import _ from 'lodash';
import pluralize from 'pluralize';

const reModelSuffix = /Model$/;

export const namingStrategyPlugin = <T extends typeof ObjectionModel>(Model: T): T & { cleanName: string; } => {
  return class NamingStrategyPlugin extends (Model as typeof ObjectionModel) {

    private static _cleanName?: string;
    private static _tableName?: string;

    static get cleanName(): string {
      if (this._cleanName) {
        return this._cleanName;
      }

      const cleanName = this.name.replace(reModelSuffix, '');
      return this._cleanName = _.snakeCase(cleanName);
    }

    static get tableName(): string {
      if (this._tableName) {
        return this._tableName;
      }

      const tableName = pluralize(this.cleanName.replace(reModelSuffix, ''));
      return this._tableName = tableName;
    }
  } as any;
}
