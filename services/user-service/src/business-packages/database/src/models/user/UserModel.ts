import Knex from 'knex';
import { StaticHookArguments } from 'objection';

import { Model } from '@zougui/database-core';

import { Role } from '../role/RoleModel';
import { Permission } from '../permission/PermissionModel';
import { UserPlatform } from '../userPlatform/UserPlatformModel';
import { LoginActivity } from '../loginActivity/LoginActivityModel';
import { connectOnce } from '../../connect';

export { Model as ObjectionModel } from 'objection';

const Table = (connect: () => Knex<any, unknown[]>) => {
  return function TableDecorator(constructor: typeof Model) {
    constructor.connect(connect);
  }
}

const Json = () => {
  return function JsonDecorator(target: any, property: string) {
    const propType = Reflect.getMetadata('design:type', target, property);
    console.log(`${property} type: ${propType.name} (returned: ${new propType()})`);

    target.constructor.jsonAttributes ??= [];
    target.constructor.jsonAttributes.push(property);
  }
}

@Table(connectOnce)
export class UserModel extends Model {
  static afterFind(arg: StaticHookArguments<UserModel>) {
    console.time('toSQL')
    const query = arg.asFindQuery();
    query.toKnexQuery().toSQL()
    console.timeEnd('toSQL')
    console.log(query.toKnexQuery().toSQL())
  }

  name!: string;
  password!: string;
  passwordValid!: boolean;
  email!: string;
  emailValid!: boolean;
  @Json()
  loginHistory!: LoginActivity[];
  @Json()
  roles!: Role[];
  @Json()
  permissions!: Permission[];
  @Json()
  platforms!: UserPlatform[];
  createdAt!: Date;
  updatedAt!: Date;
  disabledAt?: Date;

  static get relationMappings() {
    return {
      loginHistory: {
        relation: Model.HasManyRelation,
        modelClass: LoginActivity,
        join: {
          from: 'users.id',
          to: 'login_activities.userId',
        },
      },

      roles: {
        relation: Model.ManyToManyRelation,
        modelClass: Role,
        join: {
          from: 'users.id',
          through: {
            from: 'users_roles.userId',
            to: 'users_roles.roleId',
          },
          to: 'roles.id',
        },
      },

      permissions: {
        relation: Model.ManyToManyRelation,
        modelClass: Permission,
        join: {
          from: 'users.id',
          through: {
            from: 'users_permissions.userId',
            to: 'users_permissions.permissionId',
          },
          to: 'permissions.id',
        },
      },

      platforms: {
        relation: Model.HasManyRelation,
        modelClass: UserPlatform,
        join: {
          from: 'users.id',
          to: 'user_platforms.userId',
        },
      },
    };
  }
}

//console.log('UserModel.jsonAttributes', UserModel.jsonAttributes);

//export const UserModel = User.connect(connectOnce);

export namespace UserModel {
  export type Instance = InstanceType<typeof UserModel>;
}
