<template>
  <v-navigation-drawer v-model="drawer" absolute width="80%" right temporary>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="d-flex justify-space-between">
          <h2 class="text-h4 project-shelter__h3 font-weight-medium">
            Reference Data
          </h2>
          <v-btn icon @click="toggleReferenceData">
            <v-icon>mdi-close</v-icon>
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
import GHG from "@/components/reference_data/GHG.vue";
import IgesGrid2021 from "@/components/reference_data/IgesGrid2021.vue";
import Materials from "@/components/reference_data/Materials.vue";
import MaterialsTransport from "@/components/reference_data/MaterialsTransport.vue";
import { Component, Vue } from "vue-property-decorator";
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
    GHG,
    Materials,
    IgesGrid2021,
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
      tab: "iges_grid_2021",
      content: "iges_grid_2021",
      componentName: "IgesGrid2021",
    },
    { tab: "GHG", content: "GHG", componentName: "GHG" },
    { tab: "Materials", content: "materials", componentName: "Materials" },
    {
      tab: "Materials transport",
      content: "shelters_transport",
      componentName: "MaterialsTransport",
    },
  ];
  tab = 1;
}

interface MenuSurveyItem {
  tab: string;
  content: string;
  componentName: string;
}
</script>

<style></style>
