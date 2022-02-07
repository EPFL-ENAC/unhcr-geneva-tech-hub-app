<template>
  <v-sheet class="project">
    <v-row>
      <v-col>
        <v-tabs hide-slider>
          <template v-for="item in menuItems">
            <v-tab :key="item.to" :to="{ name: item.to }">{{
              item.text
            }}</v-tab>
          </template>
        </v-tabs>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <router-view />
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapActions } from "vuex";
import { Route } from "vue-router";

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
    { text: "About", to: "ShelterSustainabilityStep1" },
    { text: "Geometry", to: "ShelterSustainabilityStep2" },
    { text: "Materials", to: "ShelterSustainabilityStep3" },
    { text: "Labour", to: "ShelterSustainabilityStep4" },
    { text: "Environmental Perf", to: "ShelterSustainabilityStep5" },
    { text: "Technical Perf", to: "ShelterSustainabilityStep6" },
    { text: "Habitability", to: "ShelterSustainabilityStep7" },
    { text: "Affordability", to: "ShelterSustainabilityStep8" },
    { text: "Scorecard", to: "ShelterSustainabilityStep9" },
    { text: "Background", to: "ShelterSustainabilityStep10" },
  ];
  mounted(): void {
    console.log("mounted", this.$route.params.id);
    this.syncDB();
    this.getDoc(this.$route.params.id);
  }
  destroyed(): void {
    console.log("DESTROYED view shelter item, closing DB");
    this.closeDB();
  }
}

interface MenuItem {
  text: string;
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


<style lang="scss" >
// modify all v-slide-group
.project {
  .v-slide-group__content {
    justify-content: center;
  }
}
</style>
