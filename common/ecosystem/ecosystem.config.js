const { configureApp, AppTypes } = require('@zougui/ecosystem-core');

module.exports = {
  apps: [
    configureApp('./common/api/log-server', { appType: AppTypes.node }),
    configureApp('./common/api/workflow-server', { appType: AppTypes.node }),
    configureApp('./common/clients/log-viewer', { appType: AppTypes.react }),
  ],
}
