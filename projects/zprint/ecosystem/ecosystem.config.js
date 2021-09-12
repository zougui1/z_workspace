const { configureApp, AppTypes } = require('@zougui/ecosystem-core');

module.exports = {
  apps: [
    configureApp('projects/zprint/src/apps/zprint-client', { appType: AppTypes.react }),
  ],
};
