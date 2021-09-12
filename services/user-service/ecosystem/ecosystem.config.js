const { configureApp, AppTypes } = require('@zougui/ecosystem-core');

module.exports = {
  apps: [
    configureApp('projects/user-service/src/apps/user-server', { appType: AppTypes.node }),
  ],
};
