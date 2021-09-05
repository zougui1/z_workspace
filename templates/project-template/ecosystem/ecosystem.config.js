const { configureApp, AppTypes } = require('@zougui/ecosystem-core');

module.exports = {
  apps: [
    configureApp('projects/project/src/', { appType: AppTypes.node }),
  ],
};
