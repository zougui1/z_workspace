import { Context, Post, HttpResponseOK, ApiResponse } from '@foal/core';

import { addWorkflowEvent, WorkflowEvent } from '@zougui/workflow-service';

export class WorkflowController {

  @Post('/')
  @ApiResponse(200, {
    description: 'Add an event to a workflow',
  })
  async create(ctx: Context<any, any, WorkflowEvent>): Promise<HttpResponseOK> {
    const { body } = ctx.request;
    await addWorkflowEvent(body as WorkflowEvent);
    return new HttpResponseOK();
  }
}
