import { Exception } from '@zougui/error';

export interface WorkflowEventValidationErrorData {
  error: any;
}

export const WorkflowEventValidationError = new Exception<WorkflowEventValidationErrorData>()
  .setCode('workflow.event.validation.error')
  .setMessage('Invalid workflow event')
  .setStatus(400)
  .toClass();
