<template>
  <v-card flat>
    <v-card-text>
      <v-expansion-panels multiple>
        <v-expansion-panel v-for="(item, index) in interventions" :key="index">
          <v-expansion-panel-header>
            <template v-slot:default="{ open }">
              <v-checkbox
                :value="open"
                hide-details="auto"
                :label="item.text"
              ></v-checkbox>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>TODO</v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import "vue-class-component/hooks";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class EnergyIntervention extends Vue {
  readonly interventions: { text: string }[] = [
    {
      text: "Diffusion of improved cookstoves TIER 2",
    },
    {
      text: "Diffusion of improved cookstoves TIER 3",
    },
    {
      text: "Diffusion of clean energy TIER 3",
    },
    {
      text: "Diffusion of clean energy TIER 4",
    },
    {
      text: "Diffusion of solar cookers",
    },
  ];
}
</script>
