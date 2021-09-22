const { configureApp, AppTypes } = require('@zougui/ecosystem-core');

module.exports = {
  apps: [
    configureApp('services/file-storage/src/apps/file-api-server', { appType: AppTypes.node }),
  ],
};
