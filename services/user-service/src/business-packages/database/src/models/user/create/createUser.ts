import { UserModel } from '../UserModel';

export const createUser = async (user: CreateUserDTO): Promise<UserModel.Instance> => {
  return await UserModel.query().insert(user);
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}
