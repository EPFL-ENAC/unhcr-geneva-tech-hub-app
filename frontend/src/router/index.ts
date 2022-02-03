import VueRouter, { RouteConfig } from "vue-router";

import Apps from "../views/Apps.vue";
import Login from "../views/Login.vue";
import Vue from "vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/apps",
    name: "Apps",
    component: Apps,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/green_house_gaz",
    name: "GreenHouseGaz",
    component: () =>
      import(
        /* webpackChunkName: "green_house_gaz" */ "../views/green_house_gaz/GreenHouseGaz.vue"
      ),
    redirect: { name: "GreenHouseGazList" },
    children: [
      {
        path: "list",
        name: "GreenHouseGazList",
        component: () =>
          import(
            /* webpackChunkName: "green_house_gaz" */ "../views/green_house_gaz/GreenHouseGazList.vue"
          ),
      },
      {
        path: ":id/edit",
        name: "GreenHouseGazEdit",
        component: () =>
          import(
            /* webpackChunkName: "green_house_gaz" */ "../views/green_house_gaz/GreenHouseGazItem.vue"
          ),
        redirect: { name: "GreenHouseGazStep1" },
        children: [
          {
            name: "GreenHouseGazStep1",
            path: "1",
            meta: { step: 1 },
            component: () => {
              return import(
                /* webpackChunkName: "green_house_gaz" */ "../views/green_house_gaz/GreenHouseGazItem/GreenHouseGazStep1.vue"
              );
            },
          },
        ],
      },
    ],
  },
  {
    path: "/shelter_sustainability",
    name: "ShelterSustainability",
    component: () =>
      import(
        /* webpackChunkName: "shelter_sustainability" */ "../views/shelter_sustainability/ShelterSustainability.vue"
      ),
    redirect: { name: "ShelterSustainabilityList" },
    children: [
      {
        //   path: 'new',
        //   name: 'ProjectNew',
        //   component: ProjectItem,
        // }, {
        path: ":id/edit",
        name: "ShelterSustainabilityEdit",
        component: () =>
          import(
            /* webpackChunkName: "shelter_sustainability" */ "../views/shelter_sustainability/ShelterSustainabilityItem.vue"
          ),
        redirect: { name: "ShelterSustainabilityStep1" },
        children: [
          {
            name: "ShelterSustainabilityStep1",
            path: "1",
            meta: { step: 1 },
            component: () => {
              return import(
                /* webpackChunkName: "group-project" */ "../views/shelter_sustainability/ShelterSustainabilityItem/ProjectStep1.vue"
              );
            },
          },
          {
            name: "ShelterSustainabilityStep2",
            path: "2",
            meta: { step: 2 },
            component: () =>
              import(
                /* webpackChunkName: "group-project" */ "../views/shelter_sustainability/ShelterSustainabilityItem/ProjectStep2.vue"
              ),
          },
          {
            name: "ShelterSustainabilityStep3",
            path: "3",
            meta: { step: 3 },
            component: () =>
              import(
                /* webpackChunkName: "group-project" */ "../views/shelter_sustainability/ShelterSustainabilityItem/ProjectStep3.vue"
              ),
          },
          {
            name: "ShelterSustainabilityStep4",
            path: "4",
            meta: { step: 4 },
            component: () =>
              import(
                /* webpackChunkName: "group-project" */ "../views/shelter_sustainability/ShelterSustainabilityItem/ProjectStep4.vue"
              ),
          },
          {
            name: "ShelterSustainabilityStep5",
            path: "5",
            meta: { step: 5 },
            component: () =>
              import(
                /* webpackChunkName: "group-project" */ "../views/shelter_sustainability/ShelterSustainabilityItem/ProjectStep5.vue"
              ),
          },
          {
            name: "ShelterSustainabilityStep6",
            path: "6",
            meta: { step: 6 },
            component: () =>
              import(
                /* webpackChunkName: "group-project" */ "../views/shelter_sustainability/ShelterSustainabilityItem/ProjectStep6.vue"
              ),
          },
          {
            name: "ShelterSustainabilityStep7",
            path: "7",
            meta: { step: 7 },
            component: () =>
              import(
                /* webpackChunkName: "group-project" */ "../views/shelter_sustainability/ShelterSustainabilityItem/ProjectStep7.vue"
              ),
          },
          {
            name: "ShelterSustainabilityStep8",
            path: "8",
            meta: { step: 8 },
            component: () =>
              import(
                /* webpackChunkName: "group-project" */ "../views/shelter_sustainability/ShelterSustainabilityItem/ProjectStep8.vue"
              ),
          },
          {
            name: "ShelterSustainabilityStep9",
            path: "9",
            meta: { step: 9 },
            component: () =>
              import(
                /* webpackChunkName: "group-project" */ "../views/shelter_sustainability/ShelterSustainabilityItem/ProjectStep9.vue"
              ),
          },
          {
            name: "ShelterSustainabilityStep10",
            path: "10",
            meta: { step: 9 },
            component: () =>
              import(
                /* webpackChunkName: "group-project" */ "../views/shelter_sustainability/ShelterSustainabilityItem/ProjectStep10.vue"
              ),
          },
        ],
      },
      {
        path: "list",
        name: "ShelterSustainabilityList",
        component: () =>
          import(
            /* webpackChunkName: "shelter_sustainability" */ "../views/shelter_sustainability/ShelterSustainabilityList.vue"
          ),
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
