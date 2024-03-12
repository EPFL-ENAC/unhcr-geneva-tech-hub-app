declare global {
  interface Window {
    injectedEnvVariable: ProcessEnv;
    _env: ProcessEnv;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authModule: any;
  }
}

export {};
