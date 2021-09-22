import { Context, Get, HttpResponseOK, Hook } from '@foal/core';
//import { JWTRequired } from '@foal/jwt';

import { user } from '@user-service/database'
//import { CheckUserAbilities } from '@zougui/server-security';

export class UserController {

  @Get('/')
  //@JWTRequired({ user: userId => user.findById(+userId) })
  /*@CheckUserAbilities(({ must, can }) => {
    // the user has this permission, does not throw
    //must('read', 'Image');
    // the user does not have this permission, returns false
    can('write', 'Music');
    // the user does not have this permission, throws forbidden HTTP response
    //must('write', 'Music');
  })*/
  @Hook(ctx => {
    const { query } = ctx.request;

    for (const [name, dirtyValue] of Object.entries(query)) {
      const value = String(dirtyValue);

      const isStringParam = (param: string) => param.startsWith('"') && param.endsWith('"');
      const parseStringParam = (param: string) => param.replace(/^".*"$/, '');

      //const isArrayParam = (param: string) => param.includes(',');

      if (isStringParam(value)) {
        query[name] = parseStringParam(value);
      } else if (value.includes(',')) {
        query[name] = value.split(',');
      }
    }
  })
  async index(ctx: Context) {
    console.log(ctx.request.query)
    const { page, pageSize } = ctx.request.query;
    const users = await user.find({ page: +page, pageSize: +pageSize });

    return new HttpResponseOK(users);
  }
}
