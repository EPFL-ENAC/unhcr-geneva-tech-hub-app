import { env } from "@/env";
import router from "@/router";
import Vue from "vue";
import VueGtag from "vue-gtag";

// G-3GDCB8977V test platform
// G-TGX95V1SDH prod platform
if (env.VUE_GTAG_ID) {
  Vue.use(
    VueGtag,
    {
      config: { id: env.VUE_GTAG_ID, params: { anonymize_ip: true } },
    },
    router
  );
}
