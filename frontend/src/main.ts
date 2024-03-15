import { env } from "@/config";
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
import "./plugins/gtag";
import vuetify from "./plugins/vuetify";
import "./registerComponentHooks";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

Vue.config.productionTip = env.NODE_ENV === "production";

Vue.use(User, { store });
Vue.use(filters);
Vue.component("CountryFlag", CountryFlag);

if (env.NODE_ENV === "production" && env.VUE_APP_DSN) {
  Sentry.init({
    Vue,
    environment: env.VUE_APP_ENVIRONEMENT ?? "production",
    enabled: env.NODE_ENV === "production",
    dsn: env.VUE_APP_DSN,
    ignoreErrors: [
      "ResizeObserver loop limit exceeded",
      "The fetching process for the media resource was aborted by the user agent at the user's request.",
    ],
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
}

axios.interceptors.response.use(undefined, function (error: AxiosError) {
  (error as unknown as { originalMessage: string }).originalMessage =
    error.message;
  Object.defineProperty(error, "message", {
    get: function () {
      if (!error.response) {
        return (error as unknown as { originalMessage: string })
          .originalMessage;
      }
      return `${error?.response?.status}: ${error?.response?.statusText}`;
    },
  });
  Object.defineProperty(error, "stack", {
    get: function () {
      if (!error.response) {
        return (error as unknown as { originalMessage: string })
          .originalMessage;
      }
      return `${JSON.stringify(error.response.data)}`;
    },
  });
  if (env.NODE_ENV === "development") {
    console.trace(error);
  }
  return Promise.reject(error);
});

Vue.config.errorHandler = function (err, vm, info) {
  // handle error
  // `info` is a Vue-specific error info, e.g. which lifecycle hook
  // the error was found in. Only available in 2.2.0+
  if (env.NODE_ENV === "development") {
    console.trace(err.stack);
  }
  if (err?.name === "unauthorized") {
    // recheck the user cookie by calling the server
    store.dispatch("UserModule/getSession", { bypassLoading: true });
  }
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
  if (env.NODE_ENV === "development") {
    console.trace(info);
  }
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

  if (axios.isAxiosError(event.reason)) {
    // we already have an axios error interceptor, we don't need to notify the user again
    if (env.NODE_ENV === "development") {
      console.log(event.reason.status);
      console.error(event.reason.response);
    }
  } else {
    if (env.NODE_ENV === "development") {
      console.trace(event.reason?.stack ?? JSON.stringify(event.promise));
    }
    if (event.reason?.name === "unauthorized") {
      // recheck the user cookie by calling the server
      // we don't notify the user about this error
      store.dispatch("UserModule/getSession", { bypassLoading: true });
    } else {
      store.dispatch("notifyUser", {
        title: event.reason?.title ?? "unhandled rejection",
        message: event.reason?.message ?? event.reason,
        stack: event.reason?.stack ?? JSON.stringify(event.promise),
        type: "error",
      });
    }
  }
});

/*
 **  TODO: to fix the ResizeObserver loop problem
 **  we may do the following things
 **
 **  FIXING ResizeObserver loop completed with undelivered notifications.
 **  https://github.com/vuejs/vue-cli/issues/7431
 **  https://stackoverflow.com/questions/49384120/resizeobserver-loop-limit-exceeded
 **  use the requestFrameAnimation instead of a callback
 **  const _ = (window as any).ResizeObserver;
 **  (window as any).ResizeObserver = class ResizeObserver extends _ {
 **    constructor(callback: (...args: any[]) => void) {
 **      callback = debounce (callback, 20);
 **      super(callback);
 **    }
 **  };
 */

window.addEventListener("error", function (event) {
  //handle error here
  const { message, filename, lineno, colno, error, timeStamp } = event;
  if (env.NODE_ENV === "development") {
    console.trace(error?.stack);
  }
  // ResizeObserver loop completed with undelivered notifications.
  if (message.includes("ResizeObserver loop completed")) {
    if (env.NODE_ENV === "development") {
      console.warn(
        "We have a ResizeObserver loop problem (due to too many calls)" +
          message
      );
    }
    event.stopImmediatePropagation();
    event.stopPropagation();
    event.preventDefault();
    return false;
  }
  store.dispatch("notifyUser", {
    title: message,
    message:
      (error?.message ?? "") +
      "filename: " +
      filename +
      ", lineno: " +
      lineno +
      ", colno: " +
      colno +
      ", timestamp: " +
      (timeStamp ?? "unknown timestamp"),
    stack: error?.stack,
    type: "error",
  });
});

export default new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
