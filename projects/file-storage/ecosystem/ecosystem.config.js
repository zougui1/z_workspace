const { configureApp, AppTypes } = require('@zougui/ecosystem-core');

module.exports = {
  apps: [
    configureApp('projects/file-storage/src/api/file-api-server', { appType: AppTypes.node }),
  ],
};
