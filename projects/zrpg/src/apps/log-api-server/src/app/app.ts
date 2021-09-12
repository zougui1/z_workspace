import * as http from 'http';
//import mysqlDump from 'mysqldump';
//import path from 'path';
import { Config, createApp as foalCreateApp, displayServerURL } from '@foal/core';

import { AppController } from './controllers';

export const createApp = async (): Promise<any> => {
  return await foalCreateApp(AppController);
}

export const app = async (): Promise<any> => {
  const app = await createApp();

  const httpServer = http.createServer(app);
  const port = Config.get('port', 'number', 3001);
  httpServer.listen(port, () => displayServerURL(port));

  //#region dump SQL
  /*console.time('sql-dump')
  mysqlDump({
    connection: {
      host: process.env.DB_LOGS_HOST,
      user: process.env.DB_LOGS_USER as string,
      password: process.env.DB_LOGS_PASSWORD as string,
      database: process.env.DB_LOGS_DATABASE as string,
    },
    dumpToFile: path.join(__dirname, '../dump.sql')
  })
    .then(() => console.timeEnd('sql-dump'))*/
  //#endregion

  return app;
}
