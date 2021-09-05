import { Model } from '@zougui/database-core';

import { Permission } from '../permission/PermissionModel';
import { connectOnce } from '../../connect';

export { Model as ObjectionModel } from 'objection';

export class Role extends Model {
  static jsonAttributes = ['permissions'];

  name!: string;
  permission!: Permission[];
  createdAt!: Date;
  updatedAt!: Date;

  static get relationMappings() {
    return {
      permissions: {
        relation: Model.ManyToManyRelation,
        modelClass: Permission,
        join: {
          from: 'roles.id',
          through: {
            from: 'roles_permissions.roleId',
            to: 'roles_permissions.permissionId',
          },
          to: 'permissions.id',
        },
      },
    };
  }
}

export const RoleModel = Role.connect(connectOnce);

export namespace RoleModel {
  export type Instance = InstanceType<typeof RoleModel>;
}
