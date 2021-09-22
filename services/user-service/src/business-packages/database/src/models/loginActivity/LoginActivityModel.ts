import { Model, Table, Log, JsonColumn, BelongsToOne } from '@zougui/database-core';

import { UserPlatformModel } from '../userPlatform/UserPlatformModel';
import { connectOnce } from '../../connect';

@Table(connectOnce)
@Log()
export class LoginActivityModel extends Model {
  type!: LoginActivityType;
  country!: string;
  city?: string;
  succeeded?: boolean;
  @JsonColumn()
  tokens?: SessionToken[];
  @BelongsToOne(() => UserPlatformModel)
  platform!: UserPlatformModel;
  createdAt!: Date;
}

export interface SessionToken {
  token: string;
  disabled: boolean;
  createdAt: Date;
}

export enum LoginActivityType {
  login = 'login',
  logout = 'logout',
}
