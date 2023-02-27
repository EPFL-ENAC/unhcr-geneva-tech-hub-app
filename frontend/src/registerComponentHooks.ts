// registerComponentHooks.ts
import { Component } from "vue-property-decorator";

Component.registerHooks([
  "validations",
  "beforeRouteEnter",
  "beforeRouteLeave",
  "beforeRouteUpdate",
]);
