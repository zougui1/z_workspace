import { UserModel } from '../UserModel';

export const findUserByEmail = async (email: string): Promise<UserModel.Instance | undefined> => {
  return await UserModel.query().where('email', email).first();
}
