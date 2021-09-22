import { createUser, CreateUserDTO } from './create';
import {
  findUserByEmail,
  findUserById,
  findUsers, FindUsersOptions,
} from './read';

export const user = {
  find: findUsers,
  findByEmail: findUserByEmail,
  findById: findUserById,

  create: createUser,
}

export namespace User {
  export type FindOptions = FindUsersOptions;

  export type CreateDTO = CreateUserDTO;
}
