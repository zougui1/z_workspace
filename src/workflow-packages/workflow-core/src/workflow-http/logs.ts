import { LogBuilder } from '@zougui/logger';
import { getErrorMessage } from '@zougui/error';
import env from '@zougui/env';

import { EventData } from '../workflow-creation';

const scope = env.getScope(__filename);

export interface WorkflowEventHttpPostErrorData {
  error: any;
  event: EventData<any>;
}

export const WorkflowEventHttpPostError = new LogBuilder<WorkflowEventHttpPostErrorData>()
  .setCode('workflow.event.http.post.error')
  .setScope(scope)
  .setTopics(['workflow', 'http', 'post'])
  .setMessage(({ data }) => `An error occured while trying to upload a workflow event:\n${getErrorMessage(data.error)}`)
  .toClass();
