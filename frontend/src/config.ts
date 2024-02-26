let processEnv: Record<string, string> = {};
try {
  processEnv = { ...process.env } as Record<string, string>;
} catch (e) {
  console.log("process undefined", e);
}
const injectedEnvVariable: Record<string, string> =
  window &&
  (window as Window & { injectedEnvVariable?: Record<string, string> })
    .injectedEnvVariable
    ? (window as Window & { injectedEnvVariable?: Record<string, string> })
        .injectedEnvVariable
    : {};

// cf env.d.ts for defuintion
const env = {
  ...processEnv,
  ...injectedEnvVariable,
};
env.BASE_URL_WITHOUT_SLASH = (env.BASE_URL || "").replace(/\/$/, "");
window._env = env;
export { env };
