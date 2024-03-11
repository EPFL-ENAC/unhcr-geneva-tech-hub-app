import { env } from "@/config";
import ghgRouter from "@/router/ghgRouter";
import shelterRouter from "@/router/shelterRouter";
import userRouter from "@/router/userRouter";
import Apps from "@/views/AppListView.vue";
import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    redirect: "/apps",
  },
  ...userRouter,
  {
    path: "/apps",
    name: "Apps",
    component: Apps,
    meta: {
      title: "UNHCR-TSS",
    },
  },
];
routes.push(ghgRouter);
routes.push(shelterRouter);

const router = new VueRouter({
  mode: "history",
  base: env.BASE_URL,
  routes,
});

export default router;
