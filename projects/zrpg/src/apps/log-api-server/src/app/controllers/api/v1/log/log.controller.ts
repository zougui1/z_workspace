import { Context, Post, HttpResponseOK } from '@foal/core';

import { CreateDate } from '../../../../../hooks';

@CreateDate()
export class LogController {

  @Post('/start')
  async start(ctx: Context<any>): Promise<HttpResponseOK> {
    const { body } = ctx.request;

    // close the group in case an error occured in the client and couldn't call the exit route
    console.groupEnd();
    // add a new line to separate games, the whitespace is required for pm2 to print it in its logs
    console.log(' ');
    console.group(`[${body.__metadata__.date}] Game started`);
    console.log(`[${body.__metadata__.date}] Process: ${body.pid}`);

    return new HttpResponseOK();
  }

  @Post('/')
  async log(ctx: Context<any>): Promise<HttpResponseOK> {
    const { body } = ctx.request;

    if (body.message && typeof body.message === 'object') {
      console.group(`[${body.__metadata__.date}] (`);
      console.log(body.message);
      console.groupEnd();
      console.log(')');
    } else {
      console.log(`[${body.__metadata__.date}] ${body.message}`);
    }

    return new HttpResponseOK();
  }

  @Post('/exit')
  async exit(ctx: Context<any>): Promise<HttpResponseOK> {
    const { body } = ctx.request;

    console.log(`[${body.__metadata__.date}] Game exited`);
    console.groupEnd();

    return new HttpResponseOK();
  }
}
