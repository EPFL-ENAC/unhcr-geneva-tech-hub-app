<template>
  <v-container fluid class="project">
    <v-breadcrumbs :items="breadCrumbs">
      <template v-slot:item="{ item }">
        <v-breadcrumbs-item
          :to="item.to"
          class="text-subtitle-2 crumb-item"
          :disabled="item.disabled"
          exact
        >
          {{ item.text }}
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>
    <v-tabs
      v-if="!$route.meta.hideSiteTabs"
      class="fixed-tabs-bar"
      centered
      background-color="white"
      grow
      :show-arrows="true"
      elevation="2"
    >
      <template v-for="item in menuItems">
        <v-tab :key="item.to" :to="{ name: item.to }">
          {{ item.text }}
        </v-tab>
      </template>
    </v-tabs>
    <router-view />
  </v-container>
</template>

<script lang="ts">
import { GreenHouseGaz } from "@/store/GhgInterface";
import { Component, Vue } from "vue-property-decorator";
import { Route, RouteRecord } from "vue-router";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("GhgItemModule", ["project"]),
  },
  methods: {
    ...mapActions("GhgItemModule", [
      "getDoc",
      "updateDoc",
      "syncDB",
      "closeDB",
    ]),
  },
})
/** ProjectItem */
export default class ProjectItem extends Vue {
  syncDB!: () => null;
  getDoc!: (id: string) => null;
  closeDB!: () => null;
  $route!: Route;
  project!: GreenHouseGaz;

  // readonly menuItems: MenuItem[] = ;

  public get menuItems(): MenuItem[] {
    if (this.$can("edit", this.project)) {
      return [
        { text: "About", to: "GreenHouseGazItemAbout" },
        { text: "Users", to: "GreenHouseGazItemUsers" },
        { text: "Surveys", to: "GreenHouseGazItemSurveys" },
        { text: "Configuration", to: "GreenHouseGazItemConfiguration" },
      ];
    }
    return [
      { text: "About", to: "GreenHouseGazItemAbout" },
      { text: "Surveys", to: "GreenHouseGazItemSurveys" },
    ];
  }

  mounted(): void {
    this.syncDB();
    this.getDoc(decodeURIComponent(this.$route.params.site));
  }
  destroyed(): void {
    this.closeDB();
  }

  public get breadCrumbs(): BreadCrumb {
    const matched = [...this.$route.matched];

    const matchedRoute = matched
      .reverse()
      .find((route) => route.meta.breadCrumb);
    if (matchedRoute) {
      const breadCrumb = matchedRoute.meta.breadCrumb;
      // const breadCrumb = this.$route.meta?.breadCrumb ?? [];
      if (typeof breadCrumb === "function") {
        return breadCrumb.call(this, this.$route);
      }
      return breadCrumb;
    }
    throw new Error("no breadCrumb defined in router meta field");
  }
}

interface MenuItem {
  text: string;
  to: string;
  children?: MenuItem[];
}

interface BreadCrumb {
  text: string;
  to: RouteRecord;
}
</script>

<style lang="scss" scoped></style>
