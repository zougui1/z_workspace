import { Model, Table, Log, JsonColumn, ManyToMany } from '@zougui/database-core';

import { PermissionModel } from '../permission/PermissionModel';
import { connectOnce } from '../../connect';

export { Model as ObjectionModel } from 'objection';

@Table(connectOnce)
@Log()
export class RoleModel extends Model {
  name!: string;
  @JsonColumn()
  @ManyToMany(() => PermissionModel)
  permissions!: PermissionModel[];
  createdAt!: Date;
  updatedAt!: Date;
}
