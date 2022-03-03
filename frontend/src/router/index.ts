import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Apps from "../views/AppListView.vue";
import Login from "../views/LoginView.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    components: {
      Login,
    },
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
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
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
        path: ":id",
        name: "GreenHouseGazItem",
        component: () =>
          import(
            /* webpackChunkName: "green_house_gaz" */ "../views/green_house_gaz/GreenHouseGazItem.vue"
          ),
        redirect: { name: "GreenHouseGazEdit" },
        children: [
          {
            path: "",
            name: "GreenHouseGazEdit",
            component: () =>
              import(
                /* webpackChunkName: "green_house_gaz" */ "../views/green_house_gaz/GreenHouseGazItem/GreenHouseGazEdit.vue"
              ),
          },
          {
            name: "GreenHouseGazCompareSurveys",
            path: "compare-surveys/:surveyId",
            component: () => {
              return import(
                /* webpackChunkName: "green_house_gaz" */ "../views/green_house_gaz/GreenHouseGazItem/GreenHouseGazCompareSurveys.vue"
              );
            },
          },
          {
            name: "GreenHouseGazSurvey",
            path: "new-survey",
            component: () => {
              return import(
                /* webpackChunkName: "green_house_gaz" */ "../views/green_house_gaz/GreenHouseGazItem/GreenHouseGazSurvey.vue"
              );
            },
            redirect: { name: "GreenHouseGazStep1" },
            children: [
              {
                path: "",
                redirect: { name: "GreenHouseGazStep1" }, // default child path
              },
              {
                name: "GreenHouseGazStep1",
                path: "step-1",
                meta: { step: 1 },
                component: () => {
                  return import(
                    /* webpackChunkName: "green_house_gaz" */ "../views/green_house_gaz/GreenHouseGazItem/GreenHouseGazSurvey/GreenHouseGazSurveyStep1Energy.vue"
                  );
                },
              },
              {
                name: "GreenHouseGazStep2",
                path: "step-2",
                meta: { step: 2 },
                component: () => {
                  return import(
                    /* webpackChunkName: "green_house_gaz" */ "../views/green_house_gaz/GreenHouseGazItem/GreenHouseGazSurvey/GreenHouseGazSurveyStep2Wash.vue"
                  );
                },
              },
              {
                name: "GreenHouseGazStep3",
                path: "step-3",
                meta: { step: 3 },
                component: () => {
                  return import(
                    /* webpackChunkName: "green_house_gaz" */ "../views/green_house_gaz/GreenHouseGazItem/GreenHouseGazSurvey/GreenHouseGazSurveyStep3Offset.vue"
                  );
                },
              },
            ],
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
        path: "list",
        name: "ShelterSustainabilityList",
        component: () =>
          import(
            /* webpackChunkName: "shelter_sustainability" */ "../views/shelter_sustainability/ShelterSustainabilityList.vue"
          ),
      },
      {
        path: ":id/",
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
                /* webpackChunkName: "group-project" */ "../views/shelter_sustainability/ShelterSustainabilityItem/Step1ProjectInformation.vue"
              );
            },
          },
          {
            name: "ShelterSustainabilityStep2",
            path: "2",
            meta: { step: 2 },
            component: () =>
              import(
                /* webpackChunkName: "group-project" */ "../views/shelter_sustainability/ShelterSustainabilityItem/Step2Geometry.vue"
              ),
          },
          {
            name: "ShelterSustainabilityStep3",
            path: "3",
            meta: { step: 3 },
            component: () =>
              import(
                /* webpackChunkName: "group-project" */ "../views/shelter_sustainability/ShelterSustainabilityItem/Step3Materials.vue"
              ),
          },
          {
            name: "ShelterSustainabilityStep4",
            path: "4",
            meta: { step: 4 },
            component: () =>
              import(
                /* webpackChunkName: "group-project" */ "../views/shelter_sustainability/ShelterSustainabilityItem/Step4Labour.vue"
              ),
          },
          {
            name: "ShelterSustainabilityStep5",
            path: "5",
            meta: { step: 5 },
            component: () =>
              import(
                /* webpackChunkName: "group-project" */ "../views/shelter_sustainability/ShelterSustainabilityItem/Step5EnvironmentalPerformance.vue"
              ),
          },
          {
            name: "ShelterSustainabilityStep6",
            path: "6",
            meta: { step: 6 },
            component: () =>
              import(
                /* webpackChunkName: "group-project" */ "../views/shelter_sustainability/ShelterSustainabilityItem/Step6TechnicalPerformance.vue"
              ),
          },
          {
            name: "ShelterSustainabilityStep7",
            path: "7",
            meta: { step: 7 },
            component: () =>
              import(
                /* webpackChunkName: "group-project" */ "../views/shelter_sustainability/ShelterSustainabilityItem/Step7Habitability.vue"
              ),
          },
          {
            name: "ShelterSustainabilityStep8",
            path: "8",
            meta: { step: 8 },
            component: () =>
              import(
                /* webpackChunkName: "group-project" */ "../views/shelter_sustainability/ShelterSustainabilityItem/Step8Affordability.vue"
              ),
          },
          {
            name: "ShelterSustainabilityStep9",
            path: "9",
            meta: { step: 9 },
            component: () =>
              import(
                /* webpackChunkName: "group-project" */ "../views/shelter_sustainability/ShelterSustainabilityItem/Step9ScoreCard.vue"
              ),
          },
          {
            name: "ShelterSustainabilityStep10",
            path: "10",
            meta: { step: 9 },
            component: () =>
              import(
                /* webpackChunkName: "group-project" */ "../views/shelter_sustainability/ShelterSustainabilityItem/Step10BackgroundData.vue"
              ),
          },
        ],
      },
    ],
  },
  {
    path: "/energy",
    component: () =>
      import(/* webpackChunkName: "energy" */ "../views/energy/Energy.vue"),
    children: [
      {
        path: "",
        name: "Energy",
        component: () =>
          import(
            /* webpackChunkName: "energy-home" */ "../views/energy/EnergyHome.vue"
          ),
      },
      {
        path: "camps/:id",
        name: "EnergyCamps",
        component: () =>
          import(
            /* webpackChunkName: "energy-camp" */ "../views/energy/EnergyCamp.vue"
          ),
      },
      {
        path: "templates/:id",
        name: "EnergyTemplate",
        component: () =>
          import(
            /* webpackChunkName: "energy-template" */ "../views/energy/EnergyTemplate.vue"
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
