import { LogBuilder } from '@zougui/logger';
import { getErrorMessage } from '@zougui/error';

import { EventData } from '../workflow-creation';

export interface WorkflowEventHttpPostErrorData {
  error: any;
  event: EventData<any>;
}

export const WorkflowEventHttpPostError = new LogBuilder<WorkflowEventHttpPostErrorData>()
  .setCode('workflow.event.http.post.error')
  .setVersion('1.0')
  .setTopics(['workflow', 'http', 'post'])
  .setMessage(({ data }) => `An error occured while trying to upload a workflow event:\n${getErrorMessage(data.error)}`)
  .toClass();
