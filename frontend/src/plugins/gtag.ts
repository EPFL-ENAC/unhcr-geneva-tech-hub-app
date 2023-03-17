import router from "@/router";
import Vue from "vue";
import VueGtag from "vue-gtag";

// G-3GDCB8977V test platform
// G-TGX95V1SDH prod platform
Vue.use(
  VueGtag,
  {
    config: { id: "G-TGX95V1SDH", params: { anonymize_ip: true } },
  },
  router
);
