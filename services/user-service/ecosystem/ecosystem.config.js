const { configureApp, AppTypes } = require('@zougui/ecosystem-core');

module.exports = {
  apps: [
    configureApp('services/user-service/src/apps/user-server', { appType: AppTypes.node }),
  ],
};
