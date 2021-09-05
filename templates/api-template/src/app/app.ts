import * as http from 'http';
import { Config, createApp as foalCreateApp, displayServerURL } from '@foal/core';

import { AppController } from './app.controller';

export const createApp = async (): Promise<any> => {
  return await foalCreateApp(AppController);
}

export const app = async (): Promise<any> => {
  const app = await createApp();

  const httpServer = http.createServer(app);
  const port = Config.getOrThrow('port', 'number');
  httpServer.listen(port, () => displayServerURL(port));

  return app;
}
