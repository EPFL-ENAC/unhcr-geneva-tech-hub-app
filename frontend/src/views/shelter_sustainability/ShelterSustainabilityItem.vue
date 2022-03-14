<template>
  <v-container fluid class="project">
    <v-tabs
      class="fixed-tabs-bar"
      centered
      grow
      :show-arrows="true"
      elevation="2"
    >
      <template v-for="item in menuItems">
        <v-tab :key="item.to" :to="{ name: item.to }">
          <v-icon left>{{ item.icon }}</v-icon>
          {{ item.text }}
        </v-tab>
      </template>
    </v-tabs>
    <router-view />
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Route } from "vue-router";
import { mapActions } from "vuex";

@Component({
  methods: {
    ...mapActions("ShelterItemModule", [
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

  readonly menuItems: MenuItem[] = [
    { icon: "mdi-information", text: "About", to: "ShelterSustainabilityStep1" },
    { icon: "mdi-shape", text: "Geometry", to: "ShelterSustainabilityStep2" },
    { icon: "mdi-clipboard-text-multiple", text: "Bill of Quantities", to: "ShelterSustainabilityStep3" },
    { icon: "mdi-leaf", text: "Environmental Perf", to: "ShelterSustainabilityStep5" },
    { icon: "mdi-poll", text: "Technical Perf", to: "ShelterSustainabilityStep6" },
    { icon: "mdi-home", text: "Habitability", to: "ShelterSustainabilityStep7" },
    { icon: "mdi-account-cash", text: "Affordability", to: "ShelterSustainabilityStep8" },
    { icon: "mdi-scoreboard", text: "Scorecard", to: "ShelterSustainabilityStep9" },
    { icon: "mdi-database-arrow-right", text: "Background", to: "ShelterSustainabilityStep10" },
  ];
  mounted(): void {
    this.syncDB();
    this.getDoc(decodeURIComponent(this.$route.params.id));
  }
  destroyed(): void {
    this.closeDB();
  }
}

interface MenuItem {
  text: string;
  icon: string;
  to: string;
  children?: MenuItem[];
}
</script>

<style lang="scss" scoped>
a,
a:link,
a:visited,
a:hover,
a:active {
  text-decoration: none;
  color: inherit;
}
</style>

<style lang="scss">
// modify all v-slide-group
.project {
  padding: 0; // cancel padding from container to allow sticky
  .v-slide-group__content {
    justify-content: center;
  }
}

.project-shelter__header,
.project-shelter__h3 {
  color: var(--c-shelter);
}

.fixed-tabs-bar {
  position: -webkit-sticky;
  position: sticky;
  top: 4rem; // 16px*4
  z-index: 2;
}
</style>
