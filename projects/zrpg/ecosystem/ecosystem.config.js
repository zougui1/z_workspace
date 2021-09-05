const { configureApp, AppTypes } = require('@zougui/ecosystem-core');

module.exports = {
  apps: [
    configureApp('projects/zrpg/src/api/log-server', { appType: AppTypes.node }),
  ],
};
