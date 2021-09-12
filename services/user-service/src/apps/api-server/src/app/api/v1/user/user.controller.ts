import { Context, Get, HttpResponseOK } from '@foal/core';
import { JWTRequired } from '@foal/jwt';

import { user } from '@user-service/user-database'
import { CheckUserAbilities } from '@zougui/server-security';

export class UserController {

  @Get('/')
  @JWTRequired({ user: userId => user.findById(+userId) })
  @CheckUserAbilities(({ must, can }) => {
    // the user has this permission, does not throw
    //must('read', 'Image');
    // the user does not have this permission, returns false
    can('write', 'Music');
    // the user does not have this permission, throws forbidden HTTP response
    //must('write', 'Music');
  })
  async index(ctx: Context) {
    const { page, pageSize } = ctx.request.query;
    const users = await user.find({ page: +page, pageSize: +pageSize });

    return new HttpResponseOK(users);
  }
}
