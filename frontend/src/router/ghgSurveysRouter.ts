import { Route, RouteConfig } from "vue-router";
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
        title: "Assessment",
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
    },
  ],
} as RouteConfig;
