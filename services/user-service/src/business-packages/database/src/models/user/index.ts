import { createUser, CreateUserDTO } from './create';
import {
  findUserByEmail,
  findUserById,
  findUsers, FindUsersOptions,
} from './read';
import { UserModel } from './UserModel';

export const user = {
  find: findUsers,
  findByEmail: findUserByEmail,
  findById: findUserById,

  create: createUser,

  Model: UserModel,
}

export namespace User {
  export type FindOptions = FindUsersOptions;

  export type CreateDTO = CreateUserDTO;
}
