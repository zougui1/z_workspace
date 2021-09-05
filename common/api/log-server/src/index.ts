import 'source-map-support/register';

import { app } from './app';

app()
  .catch(err => {
    console.error(err.stack);
    process.exit(1);
  });
