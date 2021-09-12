const { configureApp, AppTypes } = require('@zougui/ecosystem-core');

module.exports = {
  apps: [
    configureApp('projects/workflow-service/src/apps/api-server', { appType: AppTypes.node }),
  ],
};
