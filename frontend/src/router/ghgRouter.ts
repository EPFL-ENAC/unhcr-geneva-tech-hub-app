import ghgSurveysRouter from "@/router/ghgSurveysRouter";
import { ghg } from "@/utils/apps";
import { RouteConfig } from "vue-router";

export default {
  path: "/green_house_gaz",
  name: "GreenHouseGaz",
  component: () =>
    import(
      /* webpackChunkName: "green_house_gaz" */ "../views/green_house_gaz/GreenHouseGaz.vue"
    ),
  meta: {
    title: ghg.title,
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
      ],
    },
    {
      path: ":country/:site",
      name: "GreenHouseGazItem",
      component: () =>
        import(
          /* webpackChunkName: "green_house_gaz" */ "../views/green_house_gaz/GreenHouseGazItem.vue"
        ),
      redirect: { name: "GreenHouseGazItemSurveysList" },
      children: [ghgSurveysRouter],
    },
  ],
} as RouteConfig;
