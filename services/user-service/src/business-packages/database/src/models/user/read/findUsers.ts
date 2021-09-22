import { ModelObject } from 'objection';

import { UserModel } from '../UserModel';

export const findUsers = async (options: FindUsersOptions): Promise<ModelObject<UserModel>[]> => {
  const { page, pageSize } = options;

  const res = await UserModel
    .query()
    .select([])
    .page(page, pageSize)
    .orderBy('id', 'DESC');

  return res.results.map(user => user.toJSON());
}

export interface FindUsersOptions {
  page: number;
  pageSize: number;
}
