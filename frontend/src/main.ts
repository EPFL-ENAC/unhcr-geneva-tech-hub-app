import "./registerServiceWorker";
import "./registerComponentHooks";

import App from "./App.vue";
import Vue from "vue";
import Vuelidate from "vuelidate";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

Vue.use(Vuelidate);

export default new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
