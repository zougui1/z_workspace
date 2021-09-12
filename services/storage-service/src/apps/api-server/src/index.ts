import 'source-map-support/register';
import env from '@zougui/env';

import { app } from './app';

env.config();

app()
  .catch(err => {
    console.error(err.stack);
    process.exit(1);
  });
