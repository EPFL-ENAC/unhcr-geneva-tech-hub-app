let processEnv: any = {};
try {
  processEnv = { ...process.env };
} catch (e) {
  console.log("process undefined", e);
}
const injectedEnvVariable =
  window && (window as any).injectedEnvVariable
    ? (window as any).injectedEnvVariable
    : {};

// cf env.d.ts for defuintion
const env = {
  ...processEnv,
  ...injectedEnvVariable,
};
window._env = env;
export { env };
