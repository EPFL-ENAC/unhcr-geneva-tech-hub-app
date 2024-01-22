<template>
  <v-navigation-drawer
    v-model="drawer"
    style="
      `height: calc(100vh - 48px);
      width: 80%;
      max-width: 80%;
      z-index: 1000;
    "
    app
    fixed
    clipped
    temporary
    width="80%"
    right
    stateless
    :hide-overlay="false"
  >
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="d-flex justify-space-between">
          <h2 class="text-h4 project__h3 font-weight-medium">Reference Data</h2>
          <v-btn icon @click="toggleReferenceData">
            <v-icon>$mdiClose</v-icon>
          </v-btn>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>
    <main class="green-house-gaz__references">
      <v-tabs v-model="tab" centered grow :show-arrows="true" elevation="2">
        <v-tab v-for="item in menuItems" :key="item.tab">
          {{ item.tab }}
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item v-for="item in menuItems" :key="item.tab">
          <component :is="item.componentName" />
        </v-tab-item>
      </v-tabs-items>
    </main>
  </v-navigation-drawer>
</template>

<script lang="ts">
import EmissionFactors from "@/components/reference_data/EmissionFactors.vue";
import GHGfNRB from "@/components/reference_data/GHGfNRB.vue";
import GHGSolarModule from "@/components/reference_data/GHGSolarModule.vue";
import IgesGrid from "@/components/reference_data/IgesGrid.vue";
import Materials from "@/components/reference_data/Materials.vue";
import MaterialsTransport from "@/components/reference_data/MaterialsTransport.vue";
import UNHCRLocation from "@/components/reference_data/UNHCRLocation.vue";
import { Component, Vue, Watch } from "vue-property-decorator";
import { Route } from "vue-router";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters(["referenceDataDrawer"]),
  },
  methods: {
    ...mapActions(["toggleReferenceData", "setReferenceDataDrawer"]),
  },
  components: {
    MaterialsTransport,
    EmissionFactors,
    GHGfNRB,
    Materials,
    IgesGrid,
    UNHCRLocation,
    GHGSolarModule,
  },
})
/** ProjectList */
export default class App extends Vue {
  referenceDataDrawer!: boolean;
  toggleReferenceData!: () => Promise<void>;
  setReferenceDataDrawer!: (value: boolean) => void;

  set drawer(value: boolean) {
    this.setReferenceDataDrawer(value);
  }
  get drawer(): boolean {
    return this.referenceDataDrawer;
  }
  readonly menuItems: MenuSurveyItem[] = [
    {
      tab: "iges grid",
      componentName: "IgesGrid",
    },
    { tab: "Emission Factors", componentName: "EmissionFactors" },
    { tab: "UNHCR Locations", componentName: "UNHCRLocation" },
    // { tab: "GHG Solar average", componentName: "GHGSolarModule" },
    { tab: "GHG fNRB", componentName: "GHGfNRB" },
    { tab: "Materials", componentName: "Materials" },
    {
      tab: "Materials transport",
      componentName: "MaterialsTransport",
    },
  ];
  tab = 1;

  @Watch("$route", { immediate: true, deep: true })
  onRouteChanged(newRoute: Route): void {
    if (newRoute.hash.includes("reference-data")) {
      const tabName = newRoute.hash.split("_")[1];
      const tabIndex = this.menuItems.findIndex((item) => item.componentName === tabName);
      if (tabIndex !== -1) {
        this.tab = tabIndex;
      }
    } else {
      this.tab = 1; // reset to default tab
    }
  }
}

interface MenuSurveyItem {
  tab: string;
  componentName: string;
}
</script>

<style></style>
