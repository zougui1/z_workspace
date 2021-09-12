import { WorkflowEventModel } from '@zougui/workflow-database';

import { validateWorkflowEvent } from '../validations';
import { WorkflowEvent } from '../types';

export const addWorkflowEvent = async (workflowEvent: WorkflowEvent): Promise<WorkflowEventModel.Instance> => {
  const validWorkflowEvent = await validateWorkflowEvent(workflowEvent);

  return await WorkflowEventModel.query().insert({
    ...validWorkflowEvent,
    workflow: {
      ...validWorkflowEvent.workflow,
      id: validWorkflowEvent.state.context.machineId,
    },
  });
}
