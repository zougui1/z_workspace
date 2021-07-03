import { Context, Get, Post, HttpResponseOK, ApiResponse } from '@foal/core';
import { createLog, findLogs } from '@zougui/logs-service';

export class LogController {

  @Get('/')
  async index(ctx: Context) {
    return new HttpResponseOK(await findLogs());
  }

  @Post('/')
  @ApiResponse(200, {
    description: 'Create a log',
  })
  async create(ctx: Context) {
    await createLog(ctx.request.body);
  }
}
