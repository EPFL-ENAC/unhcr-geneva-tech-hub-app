<template>
  <v-container class="project">
    <v-row>
      <v-col>
        <h1>This is the project item page {{ $route.name }}</h1>
      </v-col>
    </v-row>
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
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapState, mapActions } from "vuex";
import { Route } from "vue-router";

@Component({
  methods: {
    ...mapActions("ShelterItemModule", ["getDoc", "updateDoc", "syncDB"]),
  },
})
/** ProjectItem */
export default class ProjectItem extends Vue {
  syncDB!: () => any;
  getDoc!: (id: string) => any;
  $route!: Route;

  readonly menuItems: MenuItem[] = [
    { text: "ProjectInformation", to: "ShelterSustainabilityStep1" },
    { text: "Geometry", to: "ShelterSustainabilityStep2" },
    { text: "Materials", to: "ShelterSustainabilityStep3" },
    { text: "Labour", to: "ShelterSustainabilityStep4" },
    { text: "EnvironmentalPerformance", to: "ShelterSustainabilityStep5" },
    { text: "TechnicalPerformance", to: "ShelterSustainabilityStep6" },
    { text: "Habitability", to: "ShelterSustainabilityStep7" },
    { text: "Affordability", to: "ShelterSustainabilityStep8" },
    { text: "Scorecard", to: "ShelterSustainabilityStep9" },
    { text: "Background", to: "ShelterSustainabilityStep10" },
  ];
  mounted() {
    console.log("mounted", this.$route.params.id);
    this.syncDB();      
    this.getDoc(this.$route.params.id);
  }
}

interface MenuItem {
  text: string;
  to: string;
  children?: MenuItem[];
}
</script>

<style scoped>
a,
a:link,
a:visited,
a:hover,
a:active {
  text-decoration: none;
  color: inherit;
}
</style>
