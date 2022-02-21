import User from "@/plugins/user";
import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import "./registerComponentHooks";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

Vue.use(User, { store });

export default new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
