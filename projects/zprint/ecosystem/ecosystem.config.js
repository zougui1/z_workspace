const { configureApp, AppTypes } = require('@zougui/ecosystem-core');

module.exports = {
  apps: [
    configureApp('projects/zprint/src/api', { appType: AppTypes.node }),
    configureApp('projects/zprint/src/clients/zprint-client', { appType: AppTypes.react }),
  ],
};
