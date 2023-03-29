import filters from "@/plugins/filters";
import "@/plugins/leaflet";
import User from "@/plugins/user";
import "@/styles/unhcr.scss";
import { BrowserTracing } from "@sentry/tracing";
import * as Sentry from "@sentry/vue";
import axios, { AxiosError } from "axios";
import "leaflet/dist/leaflet.css";
import Vue from "vue";
import CountryFlag from "vue-country-flag";
import App from "./App.vue";
import i18n from "./i18n";
import "./plugins/gtag";
import vuetify from "./plugins/vuetify";
import "./registerComponentHooks";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;
Vue.prototype.window = window;

Vue.use(User, { store });
Vue.use(filters);
Vue.component("CountryFlag", CountryFlag);

Sentry.init({
  Vue,
  environment: process.env.VUE_APP_ENVIRONEMENT ?? "production",
  enabled: process.env.NODE_ENV === "production",
  dsn: "https://3b1d1325e5234f7a99ca6e735673f0aa@o4504854111387648.ingest.sentry.io/4504854113288192",
  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      tracePropagationTargets: [
        "localhost",
        "unhcr-tss-test.epfl.ch",
        "unhcr-tss.epfl.ch",
        /^\//,
      ],
    }),
  ],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 0.25,
});

axios.interceptors.response.use(undefined, function (error: AxiosError) {
  (error as any).originalMessage = error.message;
  Object.defineProperty(error, "message", {
    get: function () {
      if (!error.response) {
        return (error as any).originalMessage;
      }
      return `${error?.response?.status}: ${error?.response?.statusText}`;
    },
  });
  Object.defineProperty(error, "stack", {
    get: function () {
      if (!error.response) {
        return (error as any).originalMessage;
      }
      return `${JSON.stringify(error.response.data)}`;
    },
  });
  console.trace(error);
  return Promise.reject(error);
});

Vue.config.errorHandler = function (err, vm, info) {
  // handle error
  // `info` is a Vue-specific error info, e.g. which lifecycle hook
  // the error was found in. Only available in 2.2.0+
  console.trace(err.stack);
  store.dispatch("notifyUser", {
    title: info,
    message: err.message,
    stack: err.stack,
    type: "error",
  });
};

Vue.config.warnHandler = function (err, vm, info) {
  // handle warning
  // `info` is a Vue-specific error info, e.g. which lifecycle hook
  console.trace(info);
  store.dispatch("notifyUser", {
    title: `${vm.$options.name}: ${err.split(":")[0] ?? err}`,
    message: err,
    stack: info,
    type: "warning",
  });
};

window.addEventListener("unhandledrejection", function (event) {
  //handle error here
  //event.promise contains the promise object
  //event.reason contains the reason for the rejection
  console.trace(event.reason?.stack ?? JSON.stringify(event.promise));
  store.dispatch("notifyUser", {
    title: event.reason?.title ?? "unhandled rejection",
    message: event.reason?.message ?? event.reason,
    stack: event.reason?.stack ?? JSON.stringify(event.promise),
    type: "error",
  });
});

window.onerror = function (msg, url, line, col, error) {
  //code to handle or report error goes here
  console.trace(error?.stack);
  store.dispatch("notifyUser", {
    title: msg,
    message: (error?.message ?? "") + url + line + col,
    stack: error?.stack,
    type: "error",
  });
};

export default new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
