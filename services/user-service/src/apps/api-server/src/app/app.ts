import * as http from 'http';
import { createApp as foalCreateApp, displayServerURL } from '@foal/core';

import { acceptAnyOptionsRequest } from '@zougui/server-request-hooks';

import { AppController } from './app.controller';
import { PORT } from '../env';

export const createApp = async (): Promise<any> => {
  return await foalCreateApp(AppController, {
    preMiddlewares: [acceptAnyOptionsRequest],
  });
}

export const app = async (): Promise<any> => {
  const app = await createApp();

  const httpServer = http.createServer(app);
  httpServer.listen(PORT, () => displayServerURL(PORT));

  return app;
}
