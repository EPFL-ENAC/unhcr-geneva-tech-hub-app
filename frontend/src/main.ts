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

export default new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
