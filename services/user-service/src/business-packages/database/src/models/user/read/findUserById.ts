import { UserModel } from '../UserModel';

export const findUserById = async (id: number): Promise<UserModel.Instance | undefined> => {
  return await UserModel.query().findById(id);
}
