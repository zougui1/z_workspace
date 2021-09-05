import * as http from 'http';
import { Config, createApp as foalCreateApp, displayServerURL } from '@foal/core';

import { acceptAnyOptionsRequest } from '@zougui/server-request-hooks';

import { AppController } from './app.controller';

export const createApp = async (): Promise<any> => {
  return await foalCreateApp(AppController, {
    preMiddlewares: [acceptAnyOptionsRequest],
  });
}

export const app = async (): Promise<any> => {
  const app = await createApp();

  const httpServer = http.createServer(app);
  const port = Config.get('port', 'number', 3000);
  httpServer.listen(port, () => displayServerURL(port));

  return app;
}
