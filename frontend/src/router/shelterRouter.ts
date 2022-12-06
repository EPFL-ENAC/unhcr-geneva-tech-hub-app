import { shelter } from "@/utils/apps";
import { RouteConfig } from "vue-router";

export default {
  path: "/shelter_sustainability",
  name: "ShelterSustainability",
  component: () =>
    import(
      /* webpackChunkName: "shelter_sustainability" */ "../views/shelter_sustainability/ShelterSustainability.vue"
    ),
  meta: {
    title: shelter.title,
  },
  redirect: { name: "ShelterSustainabilityList" },
  children: [
    {
      path: "list",
      name: "ShelterSustainabilityList",
      component: () =>
        import(
          /* webpackChunkName: "shelter_sustainability-list" */ "../views/shelter_sustainability/ShelterSustainabilityList.vue"
        ),
    },
    {
      path: "compare",
      name: "ShelterSustainabilityCompare",
      component: () =>
        import(
          /* webpackChunkName: "shelter_sustainability-compare" */ "../views/shelter_sustainability/ShelterSustainabilityCompare.vue"
        ),
    },
    {
      path: "overview",
      name: "ShelterSustainabilityOverview",
      component: () =>
        import(
          /* webpackChunkName: "shelter_sustainability-overview" */ "../views/shelter_sustainability/ShelterSustainabilityOverview.vue"
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
              /* webpackChunkName: "group-project" */ "../views/shelter_sustainability/ShelterSustainabilityItem/Step5EnvironmentalImpact.vue"
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
          name: "ShelterSustainabilityStep9",
          path: "9",
          meta: { step: 9 },
          component: () =>
            import(
              /* webpackChunkName: "group-project" */ "../views/shelter_sustainability/ShelterSustainabilityItem/Step9ScoreCard.vue"
            ),
        },
      ],
    },
  ],
} as RouteConfig;
