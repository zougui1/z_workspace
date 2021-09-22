import { ModelObject } from 'objection';

import { UserModel } from '../UserModel';

export const findUserByEmail = async (email: string): Promise<ModelObject<UserModel> | undefined> => {
  const user = await UserModel.query().where('email', email).first();
  return user?.toJSON()
}
