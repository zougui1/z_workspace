const { configureApp, AppTypes } = require('@zougui/ecosystem-core');

module.exports = {
  apps: [
    configureApp('projects/file-storage/src/apps/file-api-server', { appType: AppTypes.node }),
  ],
};
