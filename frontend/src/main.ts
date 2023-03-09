import filters from "@/plugins/filters";
import "@/plugins/leaflet";
import User from "@/plugins/user";
import "@/styles/unhcr.scss";
import "leaflet/dist/leaflet.css";
import Vue from "vue";
import CountryFlag from "vue-country-flag";
import App from "./App.vue";
import i18n from "./i18n";
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

Vue.config.errorHandler = function (err, vm, info) {
  // handle error
  // `info` is a Vue-specific error info, e.g. which lifecycle hook
  // the error was found in. Only available in 2.2.0+
  store.dispatch("notifyUser", {
    title: info,
    message: err.message,
    stack: err.stack,
    type: "error",
  });
};

window.addEventListener("unhandledrejection", function (event) {
  //handle error here
  //event.promise contains the promise object
  //event.reason contains the reason for the rejection

  store.dispatch("notifyUser", {
    title: "unhandled rejection",
    message: event.reason,
    stack: JSON.stringify(event.promise),
    type: "error",
  });
});

window.onerror = function (msg, url, line, col, error) {
  //code to handle or report error goes here
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
