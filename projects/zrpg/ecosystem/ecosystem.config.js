const { configureApp, AppTypes } = require('@zougui/ecosystem-core');

module.exports = {
  apps: [
    configureApp('projects/zrpg/src/apps/log-server', { appType: AppTypes.node }),
  ],
};
