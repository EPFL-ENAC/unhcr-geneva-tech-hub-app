declare global {
  interface Window {
    injectedEnvVariable: ProcessEnv;
    _env: ProcessEnv;
    authModule: any;
  }
}

export {};
