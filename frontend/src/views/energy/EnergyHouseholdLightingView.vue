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
          The user provides the information related to the lighting devices for
          the base year. The number of devices is provided per 10-household
          basis, other data include the type of technology, type of fuel,
          economic and environmental characteristics. The evolution is assumed
          in the scenario section.
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
export default class EnergyHouseholdLightingView extends EnergyModuleMixin {}
</script>
