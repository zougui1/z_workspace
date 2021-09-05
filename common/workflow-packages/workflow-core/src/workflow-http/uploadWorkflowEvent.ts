import axios from 'axios';

import { logger } from '@zougui/logger';
import env from '@zougui/env';

import { WorkflowEventHttpPostError } from './logs';
import { EventData } from '../workflow-creation';

export const uploadWorkflowEvent = async (event: EventData<any>): Promise<boolean> => {
  try {
    await axios.post('http://localhost:3101/api/v1/workflows', {
      ...event,
      appName: env.APP_NAME,
    });
  } catch (error) {
    logger.error(new WorkflowEventHttpPostError({ error, event }));
    return false;
  }

  return true;
}
