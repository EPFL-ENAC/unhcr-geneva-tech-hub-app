<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-alert type="warning">
          <i><v-icon>$mdiWrench</v-icon> This module is under development</i>
        </v-alert>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <p>
          The community lighting characterizes for the base year, the street
          lighting demand and supply. The supply may consist in solar lighting
          or public / mini-grid connected street lighting. The evolution of the
          sub-system is assumed in the scenario section.
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import EnergyModuleMixin from "@/views/energy/EnergyModuleMixin.vue";
import "vue-class-component/hooks";
import { Component } from "vue-property-decorator";

@Component
export default class EnergyCommunityLightingView extends EnergyModuleMixin {}
</script>
