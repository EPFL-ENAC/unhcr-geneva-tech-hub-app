import energyRouter from "@/router/energyRouter";
import ghgRouter from "@/router/ghgRouter";
import shelterRouter from "@/router/shelterRouter";
import Apps from "@/views/AppListView.vue";
import Login from "@/views/LoginView.vue";
import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

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
    path: "/auth",
    redirect: "/login",
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
routes.push(energyRouter);

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
