declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: string;
    readonly BASE_URL: string;
    readonly VUE_APP_COUCHDB_URL: string;
    readonly VUE_APP_I18N_LOCALE: string;
    readonly VUE_APP_I18N_FALLBACK_LOCALE: string;
    readonly VUE_APP_USER_NAMESPACE: string;
    readonly VUE_APP_AUTH_TENANT_ID: string;
    readonly VUE_APP_AUTH_CLIENT_ID: string;
  }
}
