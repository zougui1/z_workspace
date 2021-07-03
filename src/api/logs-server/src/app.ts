import * as http from 'http';
import { Config, createApp as foalCreateApp, displayServerURL } from '@foal/core';

import { AppController } from './app/controllers';

export const createApp = async (): Promise<any> => {
  return await foalCreateApp(AppController);
}

export const app = async (): Promise<any> => {
  const app = await createApp();

  const httpServer = http.createServer(app);
  const port = Config.get('port', 'number', 3001);
  httpServer.listen(port, () => displayServerURL(port));

  return app;
}
