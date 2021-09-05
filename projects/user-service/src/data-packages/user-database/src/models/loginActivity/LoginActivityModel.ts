import { Model } from '@zougui/database-core';

import { UserPlatform } from '../userPlatform/UserPlatformModel';
import { connectOnce } from '../../connect';

export { Model as ObjectionModel } from 'objection';

export class LoginActivity extends Model {
  static jsonAttributes = ['tokens'];

  type!: LoginActivityType;
  country!: string;
  city?: string;
  succeeded?: boolean;
  tokens?: SessionToken[];
  platform!: UserPlatform;
  createdAt!: Date;

  static get relationMappings() {
    const { UserPlatform } = require('../userPlatform/UserPlatformModel');

    return {
      platform: {
        relation: Model.BelongsToOneRelation,
        modelClass: UserPlatform,
        join: {
          from: 'login_activities.platformId',
          to: 'user_platforms.id',
        },
      },
    };
  }
}

export const LoginActivityModel = LoginActivity.connect(connectOnce);

export namespace LoginActivityModel {
  export type Instance = InstanceType<typeof LoginActivityModel>;
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
