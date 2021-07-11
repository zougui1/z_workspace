import { Context, Get, Post, HttpResponseOK, ApiResponse } from '@foal/core';

import { createLog, createManyLogs, findLogs } from '@zougui/logs-service';
import { ILog } from '@zougui/logger';

export class LogController {

  @Get('/')
  async index(ctx: Context) {
    return new HttpResponseOK(await findLogs());
  }

  @Post('/')
  @ApiResponse(200, {
    description: 'Create a log',
  })
  async create(ctx: Context<any, any, ILog | ILog[]>): Promise<HttpResponseOK> {
    const { body } = ctx.request;

    if (Array.isArray(body)) {
      await createManyLogs(body);
    } else {
      await createLog(body);
    }

    return new HttpResponseOK();
  }
}
