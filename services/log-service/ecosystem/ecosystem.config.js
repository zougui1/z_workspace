const { configureApp, AppTypes } = require('@zougui/ecosystem-core');

module.exports = {
  apps: [
    configureApp('projects/log-service/src/apps/api-server', { appType: AppTypes.node }),
    configureApp('projects/log-service/src/apps/client', { appType: AppTypes.react }),
  ],
};
