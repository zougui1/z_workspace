import { Model } from '@zougui/database-core';

import { Role } from '../role/RoleModel';
import { Permission } from '../permission/PermissionModel';
import { UserPlatform } from '../userPlatform/UserPlatformModel';
import { LoginActivity } from '../loginActivity/LoginActivityModel';
import { connectOnce } from '../../connect';

export { Model as ObjectionModel } from 'objection';

export class User extends Model {
  static jsonAttributes = ['loginHistory', 'roles', 'permissions', 'platforms'];

  name!: string;
  password!: string;
  passwordValid!: boolean;
  email!: string;
  emailValid!: boolean;
  loginHistory!: LoginActivity[];
  roles!: Role[];
  permissions!: Permission[];
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

export const UserModel = User.connect(connectOnce);

export namespace UserModel {
  export type Instance = InstanceType<typeof UserModel>;
}
