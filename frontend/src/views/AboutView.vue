<template>
  <main class="about-view d-flex space-between">
    <v-card class="about ma-4" elevation="2">
      <v-card-text>
        <h2 class="mx-8" data-cy="aboutDisclaimer">Disclaimer</h2>
        <p class="ma-10">
          Please report any bugs
          <a
            style="font-weight: bold"
            target="_blank"
            href="https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/new/choose"
            >here</a
          >
        </p>
      </v-card-text>
      <v-divider />
      <v-card-text>
        <p class="mx-10">
          The GHG Emission Calculator and Sustainable Shelter Calculator have
          been developed at EPFL through a collaboration with the UNHCR Geneva
          Technical Hub and SDC. At EPFL the project was coordinated by the
          EssentialTech Centre. Scientific contributions were provided by the
          FAR and Smart Living laboratories, IT4Research and EssentialTech.
        </p>

        <p class="mx-10">
          The goal of the tools is to enable UNHCR to 'green' its operations by
          informing its strategies and activity planning with concrete and
          evidence-based recommendations. These elements are made available
          directly and in a user-friendly way to humanitarian practitioners
          working in the field. It will support UNHCR to align with the Pillar 2
          of its Strategic Framework for Climate Action. The tools also support
          actions toward achieving UNHCR's Operational Strategy for Climate
          Resilience and Environmental Sustainability 2021-2025.
        </p>
      </v-card-text>
      <v-card-text>
        <v-simple-table class="ma-8">
          <template #default>
            <thead>
              <tr>
                <th>Tool Name</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(app, $key) in Apps" :key="$key">
                <td>{{ app.title }}</td>
                <td>
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <p v-html="app.description"></p>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <v-divider></v-divider>
        <v-card-text>
          <h2 class="mx-8 ma-2">Map attributions</h2>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <p class="mx-10" v-html="attributionMapFull"></p>
        </v-card-text>
      </v-card-text>
    </v-card>
    <app-logo />
  </main>
</template>

<script lang="ts">
import AppLogo from "@/components/commons/AppLogo.vue";
import Apps from "@/utils/apps";
import { attributionMapFull } from "@/utils/mapWorld";
import Vue from "vue";

export default Vue.extend({
  name: "AboutView",
  components: {
    AppLogo,
  },
  data() {
    return {
      Apps,
      attributionMapFull,
    };
  },
});
</script>

<style lang="scss" scoped>
.about-view {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1 0 auto;
  height: 100%;
}
</style>
