import VueRouter, { Route, RouteConfig } from "vue-router";

import Apps from "../views/AppListView.vue";
import Login from "../views/LoginView.vue";
import Vue from "vue";
import energyRouter from "@/router/energyRouter";
import ghgRouter from "@/router/ghgRouter";
import shelterRouter from "@/router/shelterRouter";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    meta: {
      title: "Login",
    },
    components: {
      Login,
    },
  },
  {
    path: "/apps",
    name: "Apps",
    component: Apps,
    meta: {
      title: "UNHCR-TSS",
    },
  },
  {
    path: "/about",
    name: "About",
    meta: {
      title: "About",
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  }
];
routes.push(ghgRouter);
routes.push(shelterRouter);
routes.push(energyRouter);

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
