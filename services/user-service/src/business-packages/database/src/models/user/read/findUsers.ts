import { UserModel } from '../UserModel';

export const findUsers = async (options: FindUsersOptions): Promise<UserModel.Instance[]> => {
  const { page, pageSize } = options;

  const res = await UserModel
    .query()
    .page(page, pageSize)
    .orderBy('id', 'DESC');

  return res.results;
}

export interface FindUsersOptions {
  page: number;
  pageSize: number;
}
