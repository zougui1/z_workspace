import { Model } from '@zougui/database-core';

import { connectOnce } from '../../connect';

export class UserPlatform extends Model {
  static jsonAttributes = ['platform'];

  type!: UserPlatformType;
  trusted!: boolean;
  userAgent!: string;
  deviceName?: string;
  platform?: {
    os: string;
    version: string;
  };
  createdAt!: Date;
  updatedAt!: Date;

  static get relationMappings() {
    const { LoginActivity } = require('../loginActivity/LoginActivityModel');

    return {
      platform: {
        relation: Model.HasManyRelation,
        modelClass: LoginActivity,
        join: {
          from: 'user_platforms.id',
          to: 'login_activities.platformId',
        },
      },
    };
  }
}

export const UserPlatformModel = UserPlatform.connect(connectOnce);

export namespace UserPlatformModel {
  export type Instance = InstanceType<typeof UserPlatformModel>;
}

export enum UserPlatformType {
  browser = 'browser',
  mobile = 'mobile',
  desktop = 'desktop',
}
