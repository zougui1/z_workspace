import { Model } from '@zougui/database-core';

import { connectOnce } from '../../connect';

export class Something extends Model {
  createdAt!: Date;
}

export const SomethingModel = Something.connect(connectOnce);

export namespace SomethingModel {
  export type Instance = InstanceType<typeof SomethingModel>;
}
