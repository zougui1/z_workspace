import { Context, Get, Post, HttpResponseOK, ApiResponse } from '@foal/core';

import { log } from '@zougui/log-service';
import { ILog } from '@zougui/log-types';
import { PaginatedRequest } from '@zougui/server-request-hooks';

export class LogController {

  @Get('/')
  @PaginatedRequest()
  async index(ctx: Context) {
    const { page, pageSize, transaction, task } = ctx.request.query;

    console.log('query', ctx.request.query);

    const transactionId = transaction?.id;
    const taskId = task?.id;

    if (transactionId) {
      return new HttpResponseOK(await log.findTransactions(transactionId));
    } else if (taskId) {
      return new HttpResponseOK(await log.findTasks(taskId));
    }

    return new HttpResponseOK(await log.find({
      page,
      pageSize,
    }));
  }

  @Post('/')
  @ApiResponse(200, {
    description: 'Create a log',
  })
  async create(ctx: Context<any, any, ILog | ILog[]>): Promise<HttpResponseOK> {
    const { body } = ctx.request;

    if (Array.isArray(body)) {
      await log.createMany(body);
    } else {
      await log.create(body);
    }

    return new HttpResponseOK();
  }
}
