import { Route } from "vue-router";

export default {
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
};

