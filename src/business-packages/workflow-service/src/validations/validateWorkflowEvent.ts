import { doTry } from '@zougui/error';

import { workflowEventSchema } from './workflowEventSchema';
import { WorkflowEventValidationError } from './errors';
import { WorkflowEvent } from '../types';

export const validateWorkflowEvent = async (workflowEvent: any): Promise<WorkflowEvent> => {
  const validWorkflowEvent = await doTry<WorkflowEvent>(() => workflowEventSchema.validateAsync(workflowEvent))
    .reject(error => {
      console.error(error)
      return new WorkflowEventValidationError({ error })
    });

  return validWorkflowEvent;
}
