import "@/directives/hide-if-user";
import "@/directives/show-if-admin";
import "@/directives/show-if-author";
import "@/directives/show-if-specialist";
import "@/directives/show-if-super-admin";
import "@/directives/show-if-user";
import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import "./registerComponentHooks";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

export default new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
