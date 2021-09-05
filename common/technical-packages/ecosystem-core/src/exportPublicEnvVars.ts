const rePublicEnvVar = /^PUBLIC_/;
const reactAppPrefix = 'REACT_APP_';

export const exportPublicEnvVars = (envVars: NodeJS.ProcessEnv) => {
  return Object.entries(envVars).reduce((envVars, [varName, variable]) => {
    const reactAppVarName = varName.replace(rePublicEnvVar, reactAppPrefix);

    return {
      ...envVars,
      [reactAppVarName]: variable,
    };
  }, {});
}
