import { ModelObject } from 'objection';

import { UserModel } from '../UserModel';

export const createUser = async (user: CreateUserDTO): Promise<ModelObject<UserModel>> => {
  const createdUser = await UserModel.query().insert(user);
  return createdUser.toJSON();
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}
