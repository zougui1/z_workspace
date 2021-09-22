const { configureApp, AppTypes } = require('@zougui/ecosystem-core');

module.exports = {
  apps: [
    configureApp('services/log-service/src/apps/api-server', { appType: AppTypes.node }),
    configureApp('services/log-service/src/apps/client', { appType: AppTypes.react }),
  ],
};
