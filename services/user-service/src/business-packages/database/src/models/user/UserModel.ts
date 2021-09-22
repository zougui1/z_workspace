import { Model, Hide, Table, JsonColumn, ManyToMany, HasMany, Log } from '@zougui/database-core';

import { RoleModel } from '../role/RoleModel';
import { PermissionModel } from '../permission/PermissionModel';
import { UserPlatformModel } from '../userPlatform/UserPlatformModel';
import { LoginActivityModel } from '../loginActivity/LoginActivityModel';
import { connectOnce } from '../../connect';

@Table(connectOnce)
@Log()
export class UserModel extends Model {

  name!: string;
  @Hide()
  password?: string;
  passwordValid!: boolean;
  email!: string;
  emailValid!: boolean;
  @HasMany(() => LoginActivityModel)
  loginHistory!: LoginActivityModel[];
  @JsonColumn()
  @ManyToMany(() => RoleModel)
  roles!: RoleModel[];
  @JsonColumn()
  @ManyToMany(() => PermissionModel)
  permissions!: PermissionModel[];
  @JsonColumn()
  @ManyToMany(() => UserPlatformModel)
  platforms!: UserPlatformModel[];
  createdAt!: Date;
  updatedAt!: Date;
  disabledAt?: Date;
}
