import ghgRouter from "@/router/ghgRouter";
import shelterRouter from "@/router/shelterRouter";
import userRouter from "@/router/userRouter"
import Apps from "@/views/AppListView.vue";
import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    redirect: "/login",
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
  {
    path: "/error",
    name: "Error",
    meta: {
      title: "Error",
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "error" */ "../views/ErrorView.vue"),
  },
];
routes.push(ghgRouter);
routes.push(shelterRouter);

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
