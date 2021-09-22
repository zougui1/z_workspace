import { ModelObject } from 'objection';

import { UserModel } from '../UserModel';

export const findUserById = async (id: number): Promise<ModelObject<UserModel> | undefined> => {
  const user = await UserModel.query().findById(id);
  return user?.toJSON();
}
