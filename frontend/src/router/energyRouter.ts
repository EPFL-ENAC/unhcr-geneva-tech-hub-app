import { energy } from "@/utils/apps";
import { RouteConfig } from "vue-router";

export default {
  path: "/energy",
  name: "energy",
  redirect: { name: "energyHome" },
  component: () =>
    import(/* webpackChunkName: "energy" */ "../views/energy/Energy.vue"),
  meta: {
    title: energy.title,
  },
  children: [
    {
      path: "",
      name: "energyHome",
      component: () =>
        import(
          /* webpackChunkName: "energy" */ "../views/energy/EnergyHome.vue"
        ),
    },
    {
      path: "sites/:id",
      name: "energySite",
      redirect: { name: "energySiteGeneral" },
      component: () =>
        import(
          /* webpackChunkName: "energy" */ "../views/energy/EnergySite.vue"
        ),
      children: projectChildren("energySite"),
    },
    {
      path: "templates/:id",
      name: "energyTemplate",
      redirect: { name: "energyTemplateGeneral" },
      component: () =>
        import(
          /* webpackChunkName: "energy" */ "../views/energy/EnergyTemplate.vue"
        ),
      children: projectChildren("energyTemplate"),
    },
  ],
} as RouteConfig;

function projectChildren(prefix: string): RouteConfig[] {
  return [
    {
      path: "general",
      name: prefix + "General",
      component: () =>
        import(
          /* webpackChunkName: "energy" */ "../views/energy/EnergyGeneralView.vue"
        ),
    },
    {
      path: "household",
      name: prefix + "Household",
      redirect: { name: prefix + "HouseholdCooking" },
      component: () =>
        import(
          /* webpackChunkName: "energy" */ "../views/energy/EnergyHouseholdView.vue"
        ),
      children: [
        {
          path: "cooking",
          name: prefix + "HouseholdCooking",
          component: () =>
            import(
              /* webpackChunkName: "energy" */ "../views/energy/EnergyHouseholdCookingView.vue"
            ),
        },
      ],
    },
    {
      path: "community",
      name: prefix + "Community",
      component: () =>
        import(
          /* webpackChunkName: "energy" */ "../views/energy/EnergyCommunityView.vue"
        ),
    },
    {
      path: "scenario",
      name: prefix + "Scenario",
      component: () =>
        import(
          /* webpackChunkName: "energy" */ "../views/energy/EnergyScenarioView.vue"
        ),
    },
    {
      path: "intervention",
      name: prefix + "Intervention",
      component: () =>
        import(
          /* webpackChunkName: "energy" */ "../views/energy/EnergyInterventionView.vue"
        ),
    },
    {
      path: "result",
      name: prefix + "Result",
      component: () =>
        import(
          /* webpackChunkName: "energy" */ "../views/energy/EnergyResultView.vue"
        ),
    },
  ];
}
