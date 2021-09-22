import { MongoQuery } from '@casl/ability';

import { Model, Table, Log, JsonColumn } from '@zougui/database-core';

import { connectOnce } from '../../connect';

@Table(connectOnce)
@Log()
export class PermissionModel extends Model {
  name!: string;
  ability!: PermissionAbility;
  @JsonColumn()
  actions!: string[];
  @JsonColumn()
  subjects!: string[];
  @JsonColumn()
  fields?: string[];
  @JsonColumn()
  conditions?: MongoQuery;
  createdAt!: Date;
  updatedAt!: Date;
}

export enum PermissionAbility {
  can = 'can',
  cannot = 'cannot',
}
