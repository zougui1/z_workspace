import { Model, Table, Log, JsonColumn, HasMany } from '@zougui/database-core';

import { connectOnce } from '../../connect';
import { LoginActivityModel } from '../loginActivity/LoginActivityModel';

@Table(connectOnce)
@Log()
export class UserPlatformModel extends Model {

  type!: UserPlatformType;
  trusted!: boolean;
  userAgent!: string;
  deviceName?: string;
  @JsonColumn()
  platform?: {
    os: string;
    version: string;
  };
  @HasMany(() => LoginActivityModel)
  loginActivity!: LoginActivityModel[];
  createdAt!: Date;
  updatedAt!: Date;

  //! check if things work correctly as `loginActivity` is not saved in DB in the `UserPlatform` table
  /*static get relationMappings() {
    //const { LoginActivityModel } = require('../loginActivity/LoginActivityModel');

    return {
      platform: {
        relation: Model.HasManyRelation,
        modelClass: LoginActivityModel,
        join: {
          from: 'user_platforms.id',
          to: 'login_activities.platformId',
        },
      },
    };
  }*/
}

export enum UserPlatformType {
  browser = 'browser',
  mobile = 'mobile',
  desktop = 'desktop',
}
