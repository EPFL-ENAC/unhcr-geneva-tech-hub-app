import { energy } from "@/utils/apps";
import { RouteConfig } from "vue-router";

export default {
  path: "/energy",
  name: "Energy",
  redirect: { name: "EnergyHome" },
  component: () =>
    import(/* webpackChunkName: "energy" */ "../views/energy/Energy.vue"),
  meta: {
    title: energy.title,
  },
  children: [
    {
      path: "",
      name: "EnergyHome",
      component: () =>
        import(
          /* webpackChunkName: "energy" */ "../views/energy/EnergyHome.vue"
        ),
    },
    {
      path: "sites/:id",
      name: "EnergySites",
      component: () =>
        import(
          /* webpackChunkName: "energy" */ "../views/energy/EnergySite.vue"
        ),
    },
    {
      path: "templates/:id",
      name: "EnergyTemplate",
      component: () =>
        import(
          /* webpackChunkName: "energy" */ "../views/energy/EnergyTemplate.vue"
        ),
    },
  ],
} as RouteConfig;
