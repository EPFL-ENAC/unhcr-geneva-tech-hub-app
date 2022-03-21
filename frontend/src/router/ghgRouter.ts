import ghgSurveysRouter from "@/router/ghgSurveysRouter";
import { RouteConfig } from "vue-router";

export default {
  path: "/green_house_gaz",
  name: "GreenHouseGaz",
  component: () =>
    import(
      /* webpackChunkName: "green_house_gaz" */ "../views/green_house_gaz/GreenHouseGaz.vue"
    ),
  meta: {
    title: "Greenhouse gas assessment",
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
        ghgSurveysRouter,
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
          meta: {
            hideSiteTabs: true,
          },
          component: () => {
            return import(
              /* webpackChunkName: "green_house_gaz" */ "../views/green_house_gaz/GreenHouseGazItem/Compare.vue"
            );
          },
        },
      ],
    },
  ],
} as RouteConfig;
