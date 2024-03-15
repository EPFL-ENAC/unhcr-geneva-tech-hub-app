declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: string;
    readonly BASE_URL_WITHOUT_SLASH: string;
    readonly BASE_URL: string;
    readonly VUE_APP_COUCHDB_URL: string;
    readonly VUE_APP_USER_NAMESPACE: string;
    readonly VUE_APP_AUTH_TENANT_ID: string;
    readonly VUE_APP_AUTH_CLIENT_ID: string;
    readonly VUE_APP_ENVIRONEMENT: string;
    readonly VUE_APP_DSN: string;
    readonly VUE_APP_API_URL: string;
    readonly VUE_APP_TITLE: string;
    readonly VUE_GTAG_ID: string;
    readonly VUE_APP_DEACTIVATE_LOGIN_PAGE: string;
  }
}

export {};
