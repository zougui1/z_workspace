import { MongoQuery } from '@casl/ability';

import { Model } from '@zougui/database-core';

import { connectOnce } from '../../connect';

export class Permission extends Model {
  static jsonAttributes = ['actions', 'subjects', 'fields', 'conditions'];

  name!: string;
  ability!: PermissionAbility;
  actions!: string[];
  subjects!: string[];
  fields?: string[];
  conditions?: MongoQuery;
  createdAt!: Date;
  updatedAt!: Date;
}

export const PermissionModel = Permission.connect(connectOnce);

export namespace PermissionModel {
  export type Instance = InstanceType<typeof PermissionModel>;
}

export enum PermissionAbility {
  can = 'can',
  cannot = 'cannot',
}
