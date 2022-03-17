import Vue from "vue";
import VueRouter, { Route, RouteConfig } from "vue-router";
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
  },
  {
    path: "/green_house_gaz",
    name: "GreenHouseGaz",
    component: () =>
      import(
        /* webpackChunkName: "green_house_gaz" */ "../views/green_house_gaz/GreenHouseGaz.vue"
      ),
    meta: {
      title: "Green House Gaz Calculator",
    },
    redirect: { name: "GreenHouseGazList" },
    children: [
      {
        path: "",
        name: "GreenHouseGazDashboard",
        component: () =>
          import(
            /* webpackChunkName: "green_house_gaz" */ "../views/green_house_gaz/GreenHouseGazDashboard.vue"
          ),
        redirect: { name: "GreenHouseGazList" },
        children: [
          {
            path: "list",
            name: "GreenHouseGazList",
            component: () =>
              import(
                /* webpackChunkName: "green_house_gaz" */ "../views/green_house_gaz/GreenHouseGazDashboard/GreenHouseGazList.vue"
              ),
          },
          {
            path: "references",
            name: "GreenHouseGazReferences",
            component: () =>
              import(
                /* webpackChunkName: "green_house_gaz" */ "../views/green_house_gaz/GreenHouseGazDashboard/GreenHouseGazReferences.vue"
              ),
          },
        ],
      },
      {
        path: ":country/:site",
        name: "GreenHouseGazItem",
        component: () =>
          import(
            /* webpackChunkName: "green_house_gaz" */ "../views/green_house_gaz/GreenHouseGazItem.vue"
          ),

        meta: {
          breadCrumb(route: Route) {
            const country = route.params.country;
            const site = route.params.site;
            return [
              {
                text: "Dashboard",
                to: { name: "GreenHouseGazList" },
              },
              {
                text: country,
                to: {
                  name: "GreenHouseGazList",
                  hash: `#${country}`,
                },
              },
              {
                text: site,
                to: {
                  name: "GreenHouseGazItem",
                  params: {
                    site,
                  },
                },
              },
              {
                text: route?.meta?.title ?? "Undefined route title",
                to: {
                  name: route.name,
                  params: {
                    site,
                  },
                },
              },
            ];
          },
        },
        redirect: { name: "GreenHouseGazItemAbout" },
        children: [
          {
            path: "users",
            meta: {
              title: "Users",
            },
            name: "GreenHouseGazItemUsers",
            component: () =>
              import(
                /* webpackChunkName: "green_house_gaz" */ "../views/green_house_gaz/GreenHouseGazItem/Users.vue"
              ),
          },
          {
            path: "surveys",
            name: "GreenHouseGazItemSurveys",
            component: () =>
              import(
                /* webpackChunkName: "green_house_gaz" */ "../views/green_house_gaz/GreenHouseGazItem/Surveys.vue"
              ),
            redirect: { name: "GreenHouseGazItemSurveysList" },
            children: [
              {
                path: "list",
                name: "GreenHouseGazItemSurveysList",
                meta: {
                  title: "Surveys",
                },
                component: () =>
                  import(
                    /* webpackChunkName: "green_house_gaz" */ "../components/green_house_gaz/SurveysList.vue"
                  ),
              },
              {
                path: ":surveyId",
                name: "GreenHouseGazItemSurveyId",
                meta: {
                  title(route: Route) {
                    return `${decodeURIComponent(route.params.surveyId)}`;
                  },
                  hideSiteTabs: true,
                  breadCrumb(route: Route) {
                    const country = route.params.country;
                    const site = route.params.site;
                    const surveyId = route.params.surveyId;
                    const matchedTitleRoute = route.matched.find(
                      (route) => route.meta.title
                    );
                    const title = (() => {
                      if (matchedTitleRoute) {
                        const title = matchedTitleRoute.meta.title;
                        // const breadCrumb = this.$route.meta?.breadCrumb ?? [];
                        if (typeof title === "function") {
                          return title.call(this, this.$route);
                        }
                        return title;
                      }
                    })();
                    return [
                      {
                        text: "Dashboard",
                        to: { name: "GreenHouseGazList" },
                      },
                      {
                        text: country,
                        to: {
                          name: "GreenHouseGazList",
                          hash: `#${country}`,
                        },
                      },
                      {
                        text: site,
                        to: {
                          name: "GreenHouseGazItem",
                          params: {
                            site,
                          },
                        },
                      },
                      {
                        text: "Surveys",
                        to: {
                          name: "GreenHouseGazItemSurveys",
                          params: {
                            site,
                          },
                        },
                      },
                      {
                        text: title ?? surveyId ?? "Undefined route title",
                        to: {
                          name: "GreenHouseGazStep1",
                          params: {
                            site,
                          },
                        },
                      },
                      {
                        text: route.meta?.title ?? "Undefined route title",
                        to: {
                          name: route.name,
                          params: {
                            site,
                          },
                        },
                      },
                    ];
                  },
                },
                component: () => {
                  return import(
                    /* webpackChunkName: "green_house_gaz" */ "../views/green_house_gaz/GreenHouseGazItem/SurveysItem.vue"
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
                    meta: { step: 1, title: "Energy", hideSiteTabs: true },
                    component: () => {
                      return import(
                        /* webpackChunkName: "green_house_gaz" */ "../views/green_house_gaz/GreenHouseGazItem/SurveysItem/GreenHouseGazSurveyStep1Energy.vue"
                      );
                    },
                  },
                  {
                    name: "GreenHouseGazStep2",
                    path: "step-2",
                    meta: {
                      step: 2,
                      title: "WASH transport",
                      hideSiteTabs: true,
                    },
                    component: () => {
                      return import(
                        /* webpackChunkName: "green_house_gaz" */ "../views/green_house_gaz/GreenHouseGazItem/SurveysItem/GreenHouseGazSurveyStep2Wash.vue"
                      );
                    },
                  },
                  {
                    name: "GreenHouseGazStep3",
                    path: "step-3",
                    meta: {
                      step: 3,
                      title: "Shelter, Site and Materials",
                      hideSiteTabs: true,
                    },
                    component: () => {
                      return import(
                        /* webpackChunkName: "green_house_gaz" */ "../views/green_house_gaz/GreenHouseGazItem/SurveysItem/GreenHouseGazSurveyStep3ShelterAndsite.vue"
                      );
                    },
                  },
                  {
                    name: "GreenHouseGazStep4",
                    path: "step-4",
                    meta: {
                      step: 3,
                      title: "Sequestration",
                      hideSiteTabs: true,
                    },
                    component: () => {
                      return import(
                        /* webpackChunkName: "green_house_gaz" */ "../views/green_house_gaz/GreenHouseGazItem/SurveysItem/GreenHouseGazSurveyStep4Sequestration.vue"
                      );
                    },
                  },
                ],
              },
            ],
          },
          {
            path: "configuration",
            meta: {
              title: "Configuration",
            },
            name: "GreenHouseGazItemConfiguration",
            component: () =>
              import(
                /* webpackChunkName: "green_house_gaz" */ "../views/green_house_gaz/GreenHouseGazItem/Configuration.vue"
              ),
          },
          {
            path: "about",
            meta: {
              title: "About",
            },
            name: "GreenHouseGazItemAbout",
            component: () =>
              import(
                /* webpackChunkName: "green_house_gaz" */ "../views/green_house_gaz/GreenHouseGazItem/About.vue"
              ),
          },
          {
            name: "GreenHouseGazCompareSurveys",
            path: "compare-surveys",
            component: () => {
              return import(
                /* webpackChunkName: "green_house_gaz" */ "../views/green_house_gaz/GreenHouseGazItem/Compare.vue"
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
    meta: {
      title: "Shelter Sustainability",
    },
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
                /* webpackChunkName: "group-project" */ "../views/shelter_sustainability/ShelterSustainabilityItem/Step3BillOfQuantities.vue"
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
    name: "Energy",
    redirect: { name: "EnergyHome" },
    component: () =>
      import(/* webpackChunkName: "energy" */ "../views/energy/Energy.vue"),
    meta: {
      title: "Energy",
    },
    children: [
      {
        path: "",
        name: "EnergyHome",
        component: () =>
          import(
            /* webpackChunkName: "energy-home" */ "../views/energy/EnergyHome.vue"
          ),
      },
      {
        path: "sites/:id",
        name: "EnergySites",
        component: () =>
          import(
            /* webpackChunkName: "energy-site" */ "../views/energy/EnergySite.vue"
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
